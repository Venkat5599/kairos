// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {IntentRegistry} from "../src/IntentRegistry.sol";

contract IntentRegistryTest is Test {
    IntentRegistry public registry;
    
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    address public solver1 = address(4);
    address public solver2 = address(5);
    
    uint256 constant MIN_STAKE = 0.1 ether;
    uint256 constant MIN_REWARD = 0.001 ether;
    
    event IntentCreated(
        bytes32 indexed intentId,
        address indexed creator,
        string description,
        uint256 reward
    );
    
    event IntentClaimed(
        bytes32 indexed intentId,
        address indexed solver
    );
    
    event IntentCompleted(
        bytes32 indexed intentId,
        address indexed solver,
        bytes proof
    );
    
    function setUp() public {
        vm.startPrank(owner);
        registry = new IntentRegistry();
        vm.stopPrank();
        
        // Fund test accounts
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.deal(solver1, 10 ether);
        vm.deal(solver2, 10 ether);
    }
    
    // ============ Solver Registration Tests ============
    
    function testRegisterSolver() public {
        vm.startPrank(solver1);
        registry.registerSolver{value: 1 ether}();
        vm.stopPrank();
        
        (bool isActive, uint256 stake, uint256 completed, bool isPaused) = 
            registry.solvers(solver1);
        
        assertTrue(isActive);
        assertEq(stake, 1 ether);
        assertEq(completed, 0);
        assertFalse(isPaused);
    }
    
    function testCannotRegisterWithInsufficientStake() public {
        vm.startPrank(solver1);
        vm.expectRevert("Insufficient stake");
        registry.registerSolver{value: 0.05 ether}();
        vm.stopPrank();
    }
    
    function testCannotRegisterTwice() public {
        vm.startPrank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        vm.expectRevert("Already registered");
        registry.registerSolver{value: 1 ether}();
        vm.stopPrank();
    }
    
    function testUnregisterSolver() public {
        // Register first
        vm.startPrank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        uint256 balanceBefore = solver1.balance;
        registry.unregisterSolver();
        uint256 balanceAfter = solver1.balance;
        
        vm.stopPrank();
        
        (bool isActive,,,) = registry.solvers(solver1);
        assertFalse(isActive);
        assertEq(balanceAfter - balanceBefore, 1 ether);
    }
    
    // ============ Intent Creation Tests ============
    
    function testCreateIntent() public {
        vm.startPrank(user1);
        
        vm.expectEmit(true, true, false, true);
        emit IntentCreated(
            bytes32(0), // Will be computed
            user1,
            "Send 1 ETH to 0x123",
            0.1 ether
        );
        
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 1 ETH to 0x123",
            0.1 ether
        );
        
        vm.stopPrank();
        
        (
            bytes32 id,
            address creator,
            string memory description,
            ,
            uint256 reward,
            ,
            uint8 status,
            ,
            ,
        ) = registry.getIntent(intentId);
        
        assertEq(id, intentId);
        assertEq(creator, user1);
        assertEq(description, "Send 1 ETH to 0x123");
        assertEq(reward, 0.1 ether);
        assertEq(status, 0); // Pending
    }
    
    function testCannotCreateIntentWithInsufficientReward() public {
        vm.startPrank(user1);
        vm.expectRevert("Reward too low");
        registry.createIntent{value: 0.0001 ether}(
            "Send 1 ETH",
            0.0001 ether
        );
        vm.stopPrank();
    }
    
    function testCannotCreateIntentWithMismatchedValue() public {
        vm.startPrank(user1);
        vm.expectRevert("Value mismatch");
        registry.createIntent{value: 0.05 ether}(
            "Send 1 ETH",
            0.1 ether
        );
        vm.stopPrank();
    }
    
    function testCannotCreateEmptyIntent() public {
        vm.startPrank(user1);
        vm.expectRevert("Empty description");
        registry.createIntent{value: 0.1 ether}("", 0.1 ether);
        vm.stopPrank();
    }
    
    // ============ Intent Claiming Tests ============
    
    function testClaimIntent() public {
        // Register solver
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        // Create intent
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 1 ETH",
            0.1 ether
        );
        
        // Claim intent
        vm.prank(solver1);
        vm.expectEmit(true, true, false, false);
        emit IntentClaimed(intentId, solver1);
        registry.claimIntent(intentId);
        
        (,,,,,, uint8 status, address solver,,) = registry.getIntent(intentId);
        assertEq(status, 1); // Claimed
        assertEq(solver, solver1);
    }
    
    function testCannotClaimIfNotRegistered() public {
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 1 ETH",
            0.1 ether
        );
        
        vm.prank(solver1);
        vm.expectRevert("Not registered solver");
        registry.claimIntent(intentId);
    }
    
    function testCannotClaimAlreadyClaimedIntent() public {
        // Register solvers
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        vm.prank(solver2);
        registry.registerSolver{value: 1 ether}();
        
        // Create and claim intent
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 1 ETH",
            0.1 ether
        );
        
        vm.prank(solver1);
        registry.claimIntent(intentId);
        
        // Try to claim again
        vm.prank(solver2);
        vm.expectRevert("Not pending");
        registry.claimIntent(intentId);
    }
    
    // ============ Intent Completion Tests ============
    
    function testCompleteIntent() public {
        // Setup
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 1 ETH",
            0.1 ether
        );
        
        vm.prank(solver1);
        registry.claimIntent(intentId);
        
        // Complete
        uint256 balanceBefore = solver1.balance;
        
        vm.prank(solver1);
        vm.expectEmit(true, true, false, true);
        emit IntentCompleted(intentId, solver1, "0x123");
        registry.completeIntent(intentId, "0x123");
        
        uint256 balanceAfter = solver1.balance;
        
        (,,,,,, uint8 status,,,) = registry.getIntent(intentId);
        assertEq(status, 2); // Completed
        assertEq(balanceAfter - balanceBefore, 0.1 ether);
    }
    
    function testCannotCompleteUnclaimedIntent() public {
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 1 ETH",
            0.1 ether
        );
        
        vm.prank(solver1);
        vm.expectRevert("Not claimed");
        registry.completeIntent(intentId, "0x123");
    }
    
    function testCannotCompleteOtherSolversIntent() public {
        // Register both solvers
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        vm.prank(solver2);
        registry.registerSolver{value: 1 ether}();
        
        // Create and claim with solver1
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 1 ETH",
            0.1 ether
        );
        
        vm.prank(solver1);
        registry.claimIntent(intentId);
        
        // Try to complete with solver2
        vm.prank(solver2);
        vm.expectRevert("Not your intent");
        registry.completeIntent(intentId, "0x123");
    }
    
    // ============ Intent Cancellation Tests ============
    
    function testCancelIntent() public {
        vm.startPrank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 1 ETH",
            0.1 ether
        );
        
        uint256 balanceBefore = user1.balance;
        registry.cancelIntent(intentId);
        uint256 balanceAfter = user1.balance;
        
        vm.stopPrank();
        
        (,,,,,, uint8 status,,,) = registry.getIntent(intentId);
        assertEq(status, 4); // Cancelled
        assertEq(balanceAfter - balanceBefore, 0.1 ether);
    }
    
    function testCannotCancelOthersIntent() public {
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 1 ETH",
            0.1 ether
        );
        
        vm.prank(user2);
        vm.expectRevert("Not creator");
        registry.cancelIntent(intentId);
    }
    
    function testCannotCancelClaimedIntent() public {
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 1 ETH",
            0.1 ether
        );
        
        vm.prank(solver1);
        registry.claimIntent(intentId);
        
        vm.prank(user1);
        vm.expectRevert("Not pending");
        registry.cancelIntent(intentId);
    }
    
    // ============ Getter Tests ============
    
    function testGetAllIntentIds() public {
        vm.startPrank(user1);
        bytes32 id1 = registry.createIntent{value: 0.1 ether}("Intent 1", 0.1 ether);
        bytes32 id2 = registry.createIntent{value: 0.1 ether}("Intent 2", 0.1 ether);
        bytes32 id3 = registry.createIntent{value: 0.1 ether}("Intent 3", 0.1 ether);
        vm.stopPrank();
        
        bytes32[] memory ids = registry.getAllIntentIds();
        assertEq(ids.length, 3);
        assertEq(ids[0], id1);
        assertEq(ids[1], id2);
        assertEq(ids[2], id3);
    }
    
    // ============ Fuzz Tests ============
    
    function testFuzzCreateIntent(uint256 reward) public {
        vm.assume(reward >= MIN_REWARD && reward <= 100 ether);
        
        vm.deal(user1, reward);
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: reward}(
            "Fuzz test intent",
            reward
        );
        
        (,,, , uint256 actualReward,,,,, ) = registry.getIntent(intentId);
        assertEq(actualReward, reward);
    }
    
    function testFuzzSolverStake(uint256 stake) public {
        vm.assume(stake >= MIN_STAKE && stake <= 1000 ether);
        
        vm.deal(solver1, stake);
        vm.prank(solver1);
        registry.registerSolver{value: stake}();
        
        (, uint256 actualStake,,) = registry.solvers(solver1);
        assertEq(actualStake, stake);
    }
}
