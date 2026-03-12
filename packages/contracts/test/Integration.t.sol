// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/IntentRegistry.sol";
import "../src/IntentRouter.sol";
import "../src/XCMBridge.sol";

contract IntegrationTest is Test {
    IntentRegistry public registry;
    IntentRouter public router;
    XCMBridge public bridge;

    address public owner = address(this);
    address public user = address(0x1);
    address public solver = address(0x2);
    address public relayer = address(0x3);

    uint256 constant REWARD = 1 ether;
    uint256 constant STAKE = 1 ether;
    uint256 constant BASE_FEE = 0.01 ether;

    function setUp() public {
        registry = new IntentRegistry();
        router = new IntentRouter(address(registry));
        bridge = new XCMBridge(address(registry));

        bridge.addRelayer(relayer);

        vm.deal(user, 10 ether);
        vm.deal(solver, 10 ether);
        vm.deal(relayer, 10 ether);
    }

    function testFullIntentLifecycle() public {
        // 1. User creates intent
        vm.startPrank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Send 20 USDC to Alice on Moonbeam",
            data: abi.encode("crossChain", address(0x123), 20e6),
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        bytes32 intentId = registry.createIntent{value: REWARD}(params);
        vm.stopPrank();

        // 2. Router calculates route
        IntentRouter.Route memory route = router.calculateRoute(
            intentId,
            params.data
        );
        assertEq(uint(route.routeType), uint(IntentRouter.RouteType.CrossChain));

        // 3. Solver registers
        vm.startPrank(solver);
        registry.registerSolver{value: STAKE}();

        // 4. Solver executes intent
        registry.executeIntent(intentId);

        IIntent.Intent memory intent = registry.getIntent(intentId);
        assertEq(uint(intent.status), uint(IIntent.IntentStatus.Executing));
        assertEq(intent.solver, solver);

        // 5. Solver completes intent
        registry.completeIntent(intentId, abi.encode("success"));

        intent = registry.getIntent(intentId);
        assertEq(uint(intent.status), uint(IIntent.IntentStatus.Completed));

        // 6. Solver claims reward
        uint256 balanceBefore = solver.balance;
        registry.claimReward(intentId);
        uint256 balanceAfter = solver.balance;

        assertTrue(balanceAfter > balanceBefore);
        vm.stopPrank();
    }

    function testCrossChainIntentWithXCM() public {
        // 1. Create cross-chain intent
        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Bridge 10 DOT to Moonbeam",
            data: abi.encodeWithSignature("crossChain()"),
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        // 2. Solver registers and executes
        vm.startPrank(solver);
        registry.registerSolver{value: STAKE}();
        registry.executeIntent(intentId);

        // 3. Send XCM message
        bytes memory xcmPayload = abi.encode(intentId, user, 10 ether);
        bytes32 messageId = bridge.sendXCMMessage{value: BASE_FEE}(
            2000, // Moonbeam
            xcmPayload,
            300000
        );

        XCMBridge.XCMMessage memory message = bridge.getMessage(messageId);
        assertEq(uint(message.status), uint(XCMBridge.MessageStatus.Sent));
        vm.stopPrank();

        // 4. Relayer confirms delivery
        vm.prank(relayer);
        bridge.confirmDelivery(messageId, 1000);

        message = bridge.getMessage(messageId);
        assertEq(uint(message.status), uint(XCMBridge.MessageStatus.Delivered));

        // 5. Solver completes intent
        vm.prank(solver);
        registry.completeIntent(intentId, abi.encode(messageId));

        IIntent.Intent memory intent = registry.getIntent(intentId);
        assertEq(uint(intent.status), uint(IIntent.IntentStatus.Completed));
    }

    function testFailedXCMMessageRefund() public {
        // 1. Create intent
        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Cross-chain transfer",
            data: abi.encodeWithSignature("crossChain()"),
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        // 2. Solver executes
        vm.startPrank(solver);
        registry.registerSolver{value: STAKE}();
        registry.executeIntent(intentId);

        // 3. Send XCM message
        bytes memory xcmPayload = abi.encode(intentId);
        uint256 balanceBefore = solver.balance;
        bytes32 messageId = bridge.sendXCMMessage{value: BASE_FEE}(
            2000,
            xcmPayload,
            300000
        );
        vm.stopPrank();

        // 4. Relayer marks as failed
        vm.prank(relayer);
        bridge.markFailed(messageId, "Destination unreachable");

        // 5. Verify refund
        uint256 balanceAfter = solver.balance;
        assertEq(balanceAfter, balanceBefore);

        // 6. Solver marks intent as failed
        vm.prank(solver);
        registry.failIntent(intentId, "XCM message failed");

        IIntent.Intent memory intent = registry.getIntent(intentId);
        assertEq(uint(intent.status), uint(IIntent.IntentStatus.Failed));
    }

    function testMultipleSolversCompeting() public {
        address solver2 = address(0x4);
        vm.deal(solver2, 10 ether);

        // Create intent
        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test intent",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });
        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        // Both solvers register
        vm.prank(solver);
        registry.registerSolver{value: STAKE}();

        vm.prank(solver2);
        registry.registerSolver{value: STAKE}();

        // First solver executes
        vm.prank(solver);
        registry.executeIntent(intentId);

        // Second solver tries to execute (should fail)
        vm.prank(solver2);
        vm.expectRevert();
        registry.executeIntent(intentId);

        // First solver completes
        vm.prank(solver);
        registry.completeIntent(intentId, "");

        IIntent.Intent memory intent = registry.getIntent(intentId);
        assertEq(intent.solver, solver);
    }

    function testPauseEmergency() public {
        // Pause all contracts
        registry.pause();

        // Try to create intent (should fail)
        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });

        vm.expectRevert();
        registry.createIntent{value: REWARD}(params);

        // Unpause
        registry.unpause();

        // Now should work
        vm.prank(user);
        bytes32 intentId = registry.createIntent{value: REWARD}(params);
        assertTrue(intentId != bytes32(0));
    }

    function testSolverReputationSystem() public {
        // Register solver
        vm.startPrank(solver);
        registry.registerSolver{value: STAKE}();

        // Complete multiple intents to build reputation
        for (uint i = 0; i < 3; i++) {
            vm.startPrank(user);
            IIntent.IntentParams memory params = IIntent.IntentParams({
                description: "Test intent",
                data: "",
                reward: REWARD,
                deadline: block.timestamp + 1 hours
            });
            bytes32 intentId = registry.createIntent{value: REWARD}(params);
            vm.stopPrank();

            vm.startPrank(solver);
            registry.executeIntent(intentId);
            registry.completeIntent(intentId, "");
            vm.stopPrank();
        }

        ISolver.SolverInfo memory info = registry.getSolverInfo(solver);
        assertEq(info.totalExecuted, 3);
        assertEq(info.reputation, 30); // 10 per completion
    }

    function testIntentCancellationRefund() public {
        // Create intent
        vm.startPrank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test intent",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });

        uint256 balanceBefore = user.balance;
        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        // Cancel intent
        registry.cancelIntent(intentId);
        uint256 balanceAfter = user.balance;

        assertEq(balanceAfter, balanceBefore);

        IIntent.Intent memory intent = registry.getIntent(intentId);
        assertEq(uint(intent.status), uint(IIntent.IntentStatus.Cancelled));
        vm.stopPrank();
    }

    function testEventEmissions() public {
        // Test IntentCreated event
        vm.prank(user);
        IIntent.IntentParams memory params = IIntent.IntentParams({
            description: "Test",
            data: "",
            reward: REWARD,
            deadline: block.timestamp + 1 hours
        });

        vm.expectEmit(true, true, false, true);
        emit IIntent.IntentCreated(
            bytes32(0), // Will be generated
            user,
            "Test",
            REWARD,
            block.timestamp + 1 hours
        );

        bytes32 intentId = registry.createIntent{value: REWARD}(params);

        // Test SolverRegistered event
        vm.prank(solver);
        vm.expectEmit(true, false, false, true);
        emit ISolver.SolverRegistered(solver, STAKE);

        registry.registerSolver{value: STAKE}();
    }
}
