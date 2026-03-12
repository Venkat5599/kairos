// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/XCMBridge.sol";
import "../src/IntentRegistry.sol";

contract XCMBridgeTest is Test {
    XCMBridge public bridge;
    IntentRegistry public registry;

    address public owner = address(this);
    address public relayer = address(0x1);
    address public user = address(0x2);

    uint256 constant BASE_FEE = 0.01 ether;

    function setUp() public {
        registry = new IntentRegistry();
        bridge = new XCMBridge(address(registry));

        // Add relayer
        bridge.addRelayer(relayer);

        vm.deal(user, 10 ether);
        vm.deal(relayer, 10 ether);
    }

    function testSendXCMMessage() public {
        vm.startPrank(user);

        bytes memory payload = abi.encode("test", address(0x3), 100);
        uint32 destinationChain = 2000; // Moonbeam

        bytes32 messageId = bridge.sendXCMMessage{value: BASE_FEE}(
            destinationChain,
            payload,
            200000
        );

        XCMBridge.XCMMessage memory message = bridge.getMessage(messageId);

        assertEq(message.sender, user);
        assertEq(message.destinationChain, destinationChain);
        assertEq(message.fee, BASE_FEE);
        assertEq(uint(message.status), uint(XCMBridge.MessageStatus.Sent));

        vm.stopPrank();
    }

    function testFailSendXCMMessageUnsupportedChain() public {
        vm.prank(user);

        bytes memory payload = abi.encode("test");
        bridge.sendXCMMessage{value: BASE_FEE}(9999, payload, 200000);
    }

    function testFailSendXCMMessageInsufficientFee() public {
        vm.prank(user);

        bytes memory payload = abi.encode("test");
        bridge.sendXCMMessage{value: 0.001 ether}(2000, payload, 200000);
    }

    function testFailSendXCMMessageEmptyPayload() public {
        vm.prank(user);

        bytes memory payload = "";
        bridge.sendXCMMessage{value: BASE_FEE}(2000, payload, 200000);
    }

    function testConfirmDelivery() public {
        vm.prank(user);
        bytes memory payload = abi.encode("test");
        bytes32 messageId = bridge.sendXCMMessage{value: BASE_FEE}(2000, payload, 200000);

        vm.prank(relayer);
        bridge.confirmDelivery(messageId, 1000);

        XCMBridge.XCMMessage memory message = bridge.getMessage(messageId);
        assertEq(uint(message.status), uint(XCMBridge.MessageStatus.Delivered));
    }

    function testFailConfirmDeliveryNotRelayer() public {
        vm.prank(user);
        bytes memory payload = abi.encode("test");
        bytes32 messageId = bridge.sendXCMMessage{value: BASE_FEE}(2000, payload, 200000);

        vm.prank(user);
        bridge.confirmDelivery(messageId, 1000);
    }

    function testMarkFailed() public {
        vm.prank(user);
        bytes memory payload = abi.encode("test");
        bytes32 messageId = bridge.sendXCMMessage{value: BASE_FEE}(2000, payload, 200000);

        uint256 balanceBefore = user.balance;

        vm.prank(relayer);
        bridge.markFailed(messageId, "Test failure");

        uint256 balanceAfter = user.balance;

        assertEq(balanceAfter - balanceBefore, BASE_FEE);

        XCMBridge.XCMMessage memory message = bridge.getMessage(messageId);
        assertEq(uint(message.status), uint(XCMBridge.MessageStatus.Failed));
    }

    function testFailMarkFailedNotRelayer() public {
        vm.prank(user);
        bytes memory payload = abi.encode("test");
        bytes32 messageId = bridge.sendXCMMessage{value: BASE_FEE}(2000, payload, 200000);

        vm.prank(user);
        bridge.markFailed(messageId, "Test failure");
    }

    function testAddSupportedChain() public {
        uint32 newChain = 3000;

        bridge.addSupportedChain(newChain);

        assertTrue(bridge.isChainSupported(newChain));
    }

    function testFailAddSupportedChainNotOwner() public {
        vm.prank(user);
        bridge.addSupportedChain(3000);
    }

    function testRemoveSupportedChain() public {
        uint32 chain = 2000;

        assertTrue(bridge.isChainSupported(chain));

        bridge.removeSupportedChain(chain);

        assertFalse(bridge.isChainSupported(chain));
    }

    function testAddRelayer() public {
        address newRelayer = address(0x4);

        bridge.addRelayer(newRelayer);

        // Verify by trying to confirm delivery
        vm.prank(user);
        bytes memory payload = abi.encode("test");
        bytes32 messageId = bridge.sendXCMMessage{value: BASE_FEE}(2000, payload, 200000);

        vm.prank(newRelayer);
        bridge.confirmDelivery(messageId, 1000);
    }

    function testRemoveRelayer() public {
        bridge.removeRelayer(relayer);

        vm.prank(user);
        bytes memory payload = abi.encode("test");
        bytes32 messageId = bridge.sendXCMMessage{value: BASE_FEE}(2000, payload, 200000);

        vm.prank(relayer);
        vm.expectRevert();
        bridge.confirmDelivery(messageId, 1000);
    }

    function testUpdateRegistry() public {
        address newRegistry = address(0x123);

        bridge.updateRegistry(newRegistry);

        assertEq(bridge.intentRegistry(), newRegistry);
    }

    function testFailUpdateRegistryNotOwner() public {
        vm.prank(user);
        bridge.updateRegistry(address(0x123));
    }

    function testFailUpdateRegistryZeroAddress() public {
        bridge.updateRegistry(address(0));
    }

    function testMessageLifecycle() public {
        // Send message
        vm.prank(user);
        bytes memory payload = abi.encode("test");
        bytes32 messageId = bridge.sendXCMMessage{value: BASE_FEE}(2000, payload, 200000);

        XCMBridge.XCMMessage memory message = bridge.getMessage(messageId);
        assertEq(uint(message.status), uint(XCMBridge.MessageStatus.Sent));

        // Confirm delivery
        vm.prank(relayer);
        bridge.confirmDelivery(messageId, 1000);

        message = bridge.getMessage(messageId);
        assertEq(uint(message.status), uint(XCMBridge.MessageStatus.Delivered));
    }

    function testFuzzSendXCMMessage(
        uint32 destinationChain,
        uint256 gasLimit,
        uint256 fee
    ) public {
        vm.assume(fee >= BASE_FEE && fee < 10 ether);
        vm.assume(gasLimit > 0 && gasLimit < 10000000);

        // Add chain if not supported
        if (!bridge.isChainSupported(destinationChain)) {
            bridge.addSupportedChain(destinationChain);
        }

        vm.deal(user, fee);
        vm.prank(user);

        bytes memory payload = abi.encode("fuzz test");
        bytes32 messageId = bridge.sendXCMMessage{value: fee}(
            destinationChain,
            payload,
            gasLimit
        );

        XCMBridge.XCMMessage memory message = bridge.getMessage(messageId);
        assertEq(message.fee, fee);
        assertEq(message.gasLimit, gasLimit);
    }
}
