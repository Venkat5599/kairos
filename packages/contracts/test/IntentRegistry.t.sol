// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/IntentRegistry.sol";
import "../src/IntentRouter.sol";
import "../src/XCMBridge.sol";

contract IntentRegistryTest is Test {
    IntentRegistry public registry;
    IntentRouter public router;
    XCMBridge public bridge;

    address public user = address(0x1);
    address public solver = address(0x2);

    uint256 constant REWARD = 1 ether;
    uint256 constant STAKE = 1 ether;

    function setUp() public {
        registry = new IntentRegistry();
        router = new IntentRouter(address(registry));
        bridge = new XCMBridge(address(registry));

        vm.deal(user, 10 ether);
        vm.deal(solver, 10 ether);
    }

    function testCreateIntent() public {
        vm.startPrank(user);

        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Send 20 USDC to Alice",
            data: abi.encode("transfer", address(0x3), 20e6),
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });

        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        IIntent.Intent memory intent = registry.getIntent(intentId);

        assertEq(intent.creator, user);
        assertEq(intent.description, "Send 20 USDC to Alice");
        assertEq(intent.reward, REWARD);
        assertEq(uint(intent.status), uint(IIntent.IntentStatus.Pending));

        vm.stopPrank();
    }

    function testRegisterSolver() public {
        vm.startPrank(solver);

        registry.registerSolver{value: STAKE}();

        ISolver.SolverInfo memory info = registry.getSolverInfo(solver);

        assertEq(info.solverAddress, solver);
        assertEq(info.stake, STAKE);
        assertTrue(info.isActive);

        vm.stopPrank();
    }

    function testExecuteIntent() public {
        // Create intent
        vm.startPrank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Send 20 USDC to Alice",
            data: abi.encode("transfer"),
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        bytes32 intentId = registry.createIntent{value: REWARD}(params);
        vm.stopPrank();

        // Register solver
        vm.startPrank(solver);
        registry.registerSolver{value: STAKE}();

        // Execute intent
        registry.executeIntent(intentId);

        IIntent.Intent memory intent = registry.getIntent(intentId);
        assertEq(uint(intent.status), uint(IIntent.IntentStatus.Executing));
        assertEq(intent.solver, solver);

        vm.stopPrank();
    }

    function testCompleteIntent() public {
        // Setup: create intent and register solver
        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test intent",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        vm.startPrank(solver);
        registry.registerSolver{value: STAKE}();
        registry.executeIntent(intentId);

        // Complete intent
        registry.completeIntent(intentId, abi.encode("success"));

        IIntent.Intent memory intent = registry.getIntent(intentId);
        assertEq(uint(intent.status), uint(IIntent.IntentStatus.Completed));

        vm.stopPrank();
    }

    function testCancelIntent() public {
        vm.startPrank(user);

        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test intent",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        uint256 balanceBefore = user.balance;
        registry.cancelIntent(intentId);
        uint256 balanceAfter = user.balance;

        assertEq(balanceAfter - balanceBefore, REWARD);

        IIntent.Intent memory intent = registry.getIntent(intentId);
        assertEq(uint(intent.status), uint(IIntent.IntentStatus.Cancelled));

        vm.stopPrank();
    }

    function testFailExecuteNonExistentIntent() public {
        vm.prank(solver);
        registry.executeIntent(bytes32(0));
    }

    function testFailCreateIntentInsufficientReward() public {
        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        registry.createIntent{value: 0.5 ether}(params);
    }

    // Additional security tests
    function testPauseUnpause() public {
        registry.pause();

        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });

        vm.expectRevert();
        registry.createIntent{value: REWARD}(params);

        registry.unpause();

        vm.prank(user);
        bytes32 intentId = registry.createIntent{value: REWARD}(params);
        assertTrue(intentId != bytes32(0));
    }

    function testReentrancyProtection() public {
        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        vm.startPrank(solver);
        registry.registerSolver{value: STAKE}();
        registry.executeIntent(intentId);
        registry.completeIntent(intentId, "");

        // Try to claim reward twice (should fail on second attempt)
        registry.claimReward(intentId);

        vm.expectRevert();
        registry.claimReward(intentId);
        vm.stopPrank();
    }

    function testDeadlineExpiry() public {
        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        // Fast forward past deadline
        vm.warp(block.timestamp + 2 hours);

        vm.startPrank(solver);
        registry.registerSolver{value: STAKE}();

        vm.expectRevert();
        registry.executeIntent(intentId);
        vm.stopPrank();
    }

    function testSolverSlashing() public {
        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        vm.startPrank(solver);
        registry.registerSolver{value: STAKE}();

        uint256 stakeBefore = registry.getSolverInfo(solver).stake;

        registry.executeIntent(intentId);
        registry.failIntent(intentId, "Test failure");

        uint256 stakeAfter = registry.getSolverInfo(solver).stake;

        assertEq(stakeBefore - stakeAfter, 0.1 ether);
        vm.stopPrank();
    }

    function testFuzzCreateIntent(uint256 reward, uint256 deadline) public {
        vm.assume(reward > 0 && reward < 100 ether);
        vm.assume(deadline > block.timestamp && deadline < block.timestamp + 365 days);

        vm.deal(user, reward);
        vm.prank(user);

        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Fuzz test",
            data: "",
            reward: reward,
            deadline: deadline
        });

        bytes32 intentId = registry.createIntent{value: reward}(params);

        IIntent.Intent memory intent = registry.getIntent(intentId);
        assertEq(intent.reward, reward);
        assertEq(intent.deadline, deadline);
    }
}
