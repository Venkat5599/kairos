// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {IntentRegistry} from "../src/IntentRegistry.sol";
import {IntentRouter} from "../src/IntentRouter.sol";
import {XCMBridge} from "../src/XCMBridge.sol";

/**
 * @title Integration Tests
 * @notice Tests full end-to-end flows across multiple contracts
 */
contract IntegrationTest is Test {
    IntentRegistry public registry;
    IntentRouter public router;
    XCMBridge public bridge;
    
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    address public solver1 = address(4);
    address public solver2 = address(5);
    
    function setUp() public {
        vm.startPrank(owner);
        
        // Deploy contracts in correct order
        registry = new IntentRegistry();
        router = new IntentRouter(address(registry));
        bridge = new XCMBridge(address(registry));
        
        // Configure registry
        registry.setRouter(address(router));
        registry.setBridge(address(bridge));
        
        vm.stopPrank();
        
        // Fund accounts
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
        vm.deal(solver1, 100 ether);
        vm.deal(solver2, 100 ether);
    }
    
    // ============ Full Intent Lifecycle Tests ============
    
    function testFullIntentLifecycle() public {
        // 1. Register solver
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        // 2. Create intent
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Send 0.05 DEV to 0x123",
            0.1 ether
        );
        
        // 3. Claim intent
        vm.prank(solver1);
        registry.claimIntent(intentId);
        
        // 4. Complete intent
        uint256 solverBalanceBefore = solver1.balance;
        
        vm.prank(solver1);
        registry.completeIntent(intentId, "0xproof123");
        
        uint256 solverBalanceAfter = solver1.balance;
        
        // Verify final state
        (,,,,,, uint8 status,,,) = registry.getIntent(intentId);
        assertEq(status, 2); // Completed
        assertEq(solverBalanceAfter - solverBalanceBefore, 0.1 ether);
        
        // Verify solver stats
        (, , uint256 completed,) = registry.solvers(solver1);
        assertEq(completed, 1);
    }
    
    function testMultipleIntentsMultipleSolvers() public {
        // Register two solvers
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        vm.prank(solver2);
        registry.registerSolver{value: 2 ether}();
        
        // Create three intents
        vm.startPrank(user1);
        bytes32 intent1 = registry.createIntent{value: 0.1 ether}("Intent 1", 0.1 ether);
        bytes32 intent2 = registry.createIntent{value: 0.2 ether}("Intent 2", 0.2 ether);
        bytes32 intent3 = registry.createIntent{value: 0.3 ether}("Intent 3", 0.3 ether);
        vm.stopPrank();
        
        // Solver1 claims and completes intent1
        vm.startPrank(solver1);
        registry.claimIntent(intent1);
        registry.completeIntent(intent1, "proof1");
        vm.stopPrank();
        
        // Solver2 claims and completes intent2 and intent3
        vm.startPrank(solver2);
        registry.claimIntent(intent2);
        registry.completeIntent(intent2, "proof2");
        registry.claimIntent(intent3);
        registry.completeIntent(intent3, "proof3");
        vm.stopPrank();
        
        // Verify solver stats
        (, , uint256 completed1,) = registry.solvers(solver1);
        (, , uint256 completed2,) = registry.solvers(solver2);
        
        assertEq(completed1, 1);
        assertEq(completed2, 2);
    }
    
    function testIntentCancellationFlow() public {
        // Create intent
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Test intent",
            0.1 ether
        );
        
        // Cancel before claiming
        uint256 balanceBefore = user1.balance;
        
        vm.prank(user1);
        registry.cancelIntent(intentId);
        
        uint256 balanceAfter = user1.balance;
        
        // Verify refund
        assertEq(balanceAfter - balanceBefore, 0.1 ether);
        
        // Verify status
        (,,,,,, uint8 status,,,) = registry.getIntent(intentId);
        assertEq(status, 4); // Cancelled
    }
    
    // ============ Cross-Contract Integration Tests ============
    
    function testRouterIntegration() public {
        // This would test IntentRouter if it had routing logic
        // For now, verify it's connected
        assertEq(address(router.registry()), address(registry));
    }
    
    function testBridgeIntegration() public {
        // Verify bridge is connected to registry
        assertEq(bridge.intentRegistry(), address(registry));
        
        // Verify supported chains
        assertTrue(bridge.isChainSupported(0)); // Polkadot
        assertTrue(bridge.isChainSupported(1000)); // Asset Hub
        assertTrue(bridge.isChainSupported(2004)); // Moonbeam
    }
    
    // ============ Error Handling Tests ============
    
    function testCannotClaimCompletedIntent() public {
        // Register solver
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        // Create and complete intent
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Test",
            0.1 ether
        );
        
        vm.startPrank(solver1);
        registry.claimIntent(intentId);
        registry.completeIntent(intentId, "proof");
        vm.stopPrank();
        
        // Try to claim completed intent
        vm.prank(solver2);
        registry.registerSolver{value: 1 ether}();
        
        vm.prank(solver2);
        vm.expectRevert("Not pending");
        registry.claimIntent(intentId);
    }
    
    function testCannotCompleteWithoutClaiming() public {
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        vm.prank(user1);
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Test",
            0.1 ether
        );
        
        vm.prank(solver1);
        vm.expectRevert("Not claimed");
        registry.completeIntent(intentId, "proof");
    }
    
    // ============ Concurrent Operations Tests ============
    
    function testConcurrentIntentCreation() public {
        // Multiple users create intents simultaneously
        vm.prank(user1);
        bytes32 intent1 = registry.createIntent{value: 0.1 ether}("User1 Intent", 0.1 ether);
        
        vm.prank(user2);
        bytes32 intent2 = registry.createIntent{value: 0.2 ether}("User2 Intent", 0.2 ether);
        
        // Verify both intents exist
        bytes32[] memory allIntents = registry.getAllIntentIds();
        assertEq(allIntents.length, 2);
        assertEq(allIntents[0], intent1);
        assertEq(allIntents[1], intent2);
    }
    
    function testConcurrentSolverRegistration() public {
        // Multiple solvers register simultaneously
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        vm.prank(solver2);
        registry.registerSolver{value: 2 ether}();
        
        // Verify both are registered
        (bool active1,,,) = registry.solvers(solver1);
        (bool active2,,,) = registry.solvers(solver2);
        
        assertTrue(active1);
        assertTrue(active2);
    }
    
    // ============ State Consistency Tests ============
    
    function testStateConsistencyAfterMultipleOperations() public {
        // Register solver
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        // Create multiple intents
        vm.startPrank(user1);
        bytes32 intent1 = registry.createIntent{value: 0.1 ether}("Intent 1", 0.1 ether);
        bytes32 intent2 = registry.createIntent{value: 0.2 ether}("Intent 2", 0.2 ether);
        bytes32 intent3 = registry.createIntent{value: 0.3 ether}("Intent 3", 0.3 ether);
        vm.stopPrank();
        
        // Complete intent1
        vm.startPrank(solver1);
        registry.claimIntent(intent1);
        registry.completeIntent(intent1, "proof1");
        vm.stopPrank();
        
        // Cancel intent2
        vm.prank(user1);
        registry.cancelIntent(intent2);
        
        // Leave intent3 pending
        
        // Verify state consistency
        bytes32[] memory allIntents = registry.getAllIntentIds();
        assertEq(allIntents.length, 3);
        
        (,,,,,, uint8 status1,,,) = registry.getIntent(intent1);
        (,,,,,, uint8 status2,,,) = registry.getIntent(intent2);
        (,,,,,, uint8 status3,,,) = registry.getIntent(intent3);
        
        assertEq(status1, 2); // Completed
        assertEq(status2, 4); // Cancelled
        assertEq(status3, 0); // Pending
    }
    
    // ============ Gas Optimization Tests ============
    
    function testGasOptimization() public {
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        // Measure gas for create
        vm.prank(user1);
        uint256 gasBefore = gasleft();
        bytes32 intentId = registry.createIntent{value: 0.1 ether}(
            "Test intent",
            0.1 ether
        );
        uint256 gasUsed = gasBefore - gasleft();
        
        console2.log("Gas used for createIntent:", gasUsed);
        assertLt(gasUsed, 150000); // Should be less than 150k
        
        // Measure gas for claim
        vm.prank(solver1);
        gasBefore = gasleft();
        registry.claimIntent(intentId);
        gasUsed = gasBefore - gasleft();
        
        console2.log("Gas used for claimIntent:", gasUsed);
        assertLt(gasUsed, 100000); // Should be less than 100k
        
        // Measure gas for complete
        vm.prank(solver1);
        gasBefore = gasleft();
        registry.completeIntent(intentId, "proof");
        gasUsed = gasBefore - gasleft();
        
        console2.log("Gas used for completeIntent:", gasUsed);
        assertLt(gasUsed, 90000); // Should be less than 90k
    }
    
    // ============ Edge Case Tests ============
    
    function testMaximumIntents() public {
        vm.prank(solver1);
        registry.registerSolver{value: 10 ether}();
        
        // Create many intents
        vm.startPrank(user1);
        for (uint i = 0; i < 10; i++) {
            registry.createIntent{value: 0.01 ether}(
                string(abi.encodePacked("Intent ", i)),
                0.01 ether
            );
        }
        vm.stopPrank();
        
        // Verify all created
        bytes32[] memory allIntents = registry.getAllIntentIds();
        assertEq(allIntents.length, 10);
    }
    
    function testSolverUnregisterAndReregister() public {
        // Register
        vm.prank(solver1);
        registry.registerSolver{value: 1 ether}();
        
        // Unregister
        vm.prank(solver1);
        registry.unregisterSolver();
        
        // Verify unregistered
        (bool active,,,) = registry.solvers(solver1);
        assertFalse(active);
        
        // Re-register
        vm.prank(solver1);
        registry.registerSolver{value: 2 ether}();
        
        // Verify re-registered
        (active,,,) = registry.solvers(solver1);
        assertTrue(active);
    }
}
