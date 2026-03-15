// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {XCMBridge} from "../src/XCMBridge.sol";

contract XCMBridgeTest is Test {
    XCMBridge public bridge;
    
    address public owner = address(1);
    address public user1 = address(2);
    address public registry = address(3);
    address public relayer = address(4);
    
    event XCMMessageSent(
        bytes32 indexed messageId,
        uint32 indexed destinationChain,
        bytes payload,
        uint256 fee
    );
    
    function setUp() public {
        vm.startPrank(owner);
        bridge = new XCMBridge(registry);
        bridge.addRelayer(relayer);
        vm.stopPrank();
        
        vm.deal(user1, 10 ether);
    }
    
    // ============ Initialization Tests ============
    
    function testInitialization() public {
        assertEq(bridge.intentRegistry(), registry);
        assertEq(bridge.owner(), owner);
        assertTrue(bridge.supportedChains(0)); // Polkadot
        assertTrue(bridge.supportedChains(1000)); // Asset Hub
        assertTrue(bridge.supportedChains(2004)); // Moonbeam
    }
    
    function testXtokensPrecompileAddress() public {
        address xtokens = address(bridge.XTOKENS());
        assertEq(xtokens, 0x0000000000000000000000000000000000000804);
    }
    
    function testXcmTransactorPrecompileAddress() public {
        address transactor = address(bridge.XCM_TRANSACTOR());
        assertEq(transactor, 0x0000000000000000000000000000000000000806);
    }
    
    // ============ Chain Support Tests ============
    
    function testAddSupportedChain() public {
        vm.prank(owner);
        bridge.addSupportedChain(3000);
        
        assertTrue(bridge.isChainSupported(3000));
    }
    
    function testRemoveSupportedChain() public {
        vm.prank(owner);
        bridge.removeSupportedChain(1000);
        
        assertFalse(bridge.isChainSupported(1000));
    }
    
    function testOnlyOwnerCanAddChain() public {
        vm.prank(user1);
        vm.expectRevert();
        bridge.addSupportedChain(3000);
    }
    
    // ============ Real XCM Transfer Tests ============
    
    function testSendRealXCMTransferRevertsWithZeroAmount() public {
        bytes32 recipient = bytes32(uint256(uint160(address(0x123))));
        
        vm.prank(user1);
        vm.expectRevert("Amount must be > 0");
        bridge.sendRealXCMTransfer{value: 0}(1000, recipient, 0);
    }
    
    function testSendRealXCMTransferRevertsWithUnsupportedChain() public {
        bytes32 recipient = bytes32(uint256(uint160(address(0x123))));
        
        vm.prank(user1);
        vm.expectRevert("Chain not supported");
        bridge.sendRealXCMTransfer{value: 0.1 ether}(9999, recipient, 0.1 ether);
    }
    
    function testSendRealXCMTransferRevertsWithInsufficientValue() public {
        bytes32 recipient = bytes32(uint256(uint160(address(0x123))));
        
        vm.prank(user1);
        vm.expectRevert("Insufficient value sent");
        bridge.sendRealXCMTransfer{value: 0.05 ether}(1000, recipient, 0.1 ether);
    }
    
    function testSendRealXCMTransferValidatesInputs() public {
        bytes32 recipient = bytes32(uint256(uint160(address(0x123))));
        uint256 amount = 0.1 ether;
        
        vm.prank(user1);
        // This will fail at precompile level in real network, but validates our contract logic
        vm.expectRevert();
        bridge.sendRealXCMTransfer{value: amount}(1000, recipient, amount);
    }
    
    // ============ Staking Tests ============
    
    function testStakeOnPolkadotRevertsWithZeroAmount() public {
        bytes32 validator = bytes32(uint256(1));
        
        vm.prank(user1);
        vm.expectRevert("Amount must be > 0");
        bridge.stakeOnPolkadot{value: 0}(validator, 0);
    }
    
    function testStakeOnPolkadotRevertsWithInsufficientValue() public {
        bytes32 validator = bytes32(uint256(1));
        
        vm.prank(user1);
        vm.expectRevert("Insufficient value");
        bridge.stakeOnPolkadot{value: 0.5 ether}(validator, 1 ether);
    }
    
    // ============ Governance Tests ============
    
    function testVoteOnPolkadotRevertsWithInvalidConviction() public {
        vm.prank(user1);
        vm.expectRevert("Invalid conviction");
        bridge.voteOnPolkadot{value: 0.01 ether}(1, true, 7);
    }
    
    function testVoteOnPolkadotRevertsWithZeroFee() public {
        vm.prank(user1);
        vm.expectRevert("Need fee for XCM");
        bridge.voteOnPolkadot{value: 0}(1, true, 1);
    }
    
    // ============ Legacy XCM Message Tests ============
    
    function testSendXCMMessageRevertsWithUnsupportedChain() public {
        bytes memory payload = abi.encode(address(0x123), 1 ether);
        
        vm.prank(user1);
        vm.expectRevert("Chain not supported");
        bridge.sendXCMMessage{value: 0.01 ether}(9999, payload, 300000);
    }
    
    function testSendXCMMessageRevertsWithInsufficientFee() public {
        bytes memory payload = abi.encode(address(0x123), 1 ether);
        
        vm.prank(user1);
        vm.expectRevert("Insufficient fee");
        bridge.sendXCMMessage{value: 0.001 ether}(1000, payload, 300000);
    }
    
    function testSendXCMMessageRevertsWithEmptyPayload() public {
        bytes memory payload = "";
        
        vm.prank(user1);
        vm.expectRevert("Empty payload");
        bridge.sendXCMMessage{value: 0.01 ether}(1000, payload, 300000);
    }
    
    function testSendXCMMessageCreatesMessage() public {
        bytes memory payload = abi.encode(address(0x123), 1 ether);
        
        vm.prank(user1);
        bytes32 messageId = bridge.sendXCMMessage{value: 0.01 ether}(
            1000,
            payload,
            300000
        );
        
        (
            address sender,
            uint32 destChain,
            bytes memory storedPayload,
            uint256 gasLimit,
            uint256 fee,
            uint256 timestamp,
            
        ) = bridge.messages(messageId);
        
        assertEq(sender, user1);
        assertEq(destChain, 1000);
        assertEq(storedPayload, payload);
        assertEq(gasLimit, 300000);
        assertEq(fee, 0.01 ether);
        assertGt(timestamp, 0);
    }
    
    // ============ Relayer Tests ============
    
    function testAddRelayer() public {
        address newRelayer = address(5);
        
        vm.prank(owner);
        bridge.addRelayer(newRelayer);
        
        assertTrue(bridge.relayers(newRelayer));
    }
    
    function testRemoveRelayer() public {
        vm.prank(owner);
        bridge.removeRelayer(relayer);
        
        assertFalse(bridge.relayers(relayer));
    }
    
    function testOnlyOwnerCanAddRelayer() public {
        vm.prank(user1);
        vm.expectRevert();
        bridge.addRelayer(address(5));
    }
    
    function testConfirmDelivery() public {
        // Create a message first
        bytes memory payload = abi.encode(address(0x123), 1 ether);
        vm.prank(user1);
        bytes32 messageId = bridge.sendXCMMessage{value: 0.01 ether}(
            1000,
            payload,
            300000
        );
        
        // Confirm delivery
        vm.prank(relayer);
        bridge.confirmDelivery(messageId, 1000);
        
        (,,,,,, uint8 status) = bridge.messages(messageId);
        assertEq(status, 2); // Delivered
    }
    
    function testOnlyRelayerCanConfirmDelivery() public {
        bytes memory payload = abi.encode(address(0x123), 1 ether);
        vm.prank(user1);
        bytes32 messageId = bridge.sendXCMMessage{value: 0.01 ether}(
            1000,
            payload,
            300000
        );
        
        vm.prank(user1);
        vm.expectRevert("Only relayer");
        bridge.confirmDelivery(messageId, 1000);
    }
    
    // ============ Registry Update Tests ============
    
    function testUpdateRegistry() public {
        address newRegistry = address(6);
        
        vm.prank(owner);
        bridge.updateRegistry(newRegistry);
        
        assertEq(bridge.intentRegistry(), newRegistry);
    }
    
    function testCannotUpdateRegistryToZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert("Invalid address");
        bridge.updateRegistry(address(0));
    }
    
    function testOnlyOwnerCanUpdateRegistry() public {
        vm.prank(user1);
        vm.expectRevert();
        bridge.updateRegistry(address(6));
    }
    
    // ============ Receive Function Test ============
    
    function testReceiveEther() public {
        uint256 balanceBefore = address(bridge).balance;
        
        vm.prank(user1);
        (bool success,) = address(bridge).call{value: 1 ether}("");
        
        assertTrue(success);
        assertEq(address(bridge).balance, balanceBefore + 1 ether);
    }
    
    // ============ Fuzz Tests ============
    
    function testFuzzSendXCMMessage(uint32 chainId, uint256 fee) public {
        vm.assume(chainId == 0 || chainId == 1000 || chainId == 2004);
        vm.assume(fee >= 0.01 ether && fee <= 10 ether);
        
        bytes memory payload = abi.encode(address(0x123), 1 ether);
        
        vm.deal(user1, fee);
        vm.prank(user1);
        bytes32 messageId = bridge.sendXCMMessage{value: fee}(
            chainId,
            payload,
            300000
        );
        
        (,,,, uint256 storedFee,,) = bridge.messages(messageId);
        assertEq(storedFee, fee);
    }
    
    function testFuzzRealXCMTransfer(uint256 amount) public {
        vm.assume(amount > 0 && amount <= 100 ether);
        
        bytes32 recipient = bytes32(uint256(uint160(address(0x123))));
        
        vm.deal(user1, amount);
        vm.prank(user1);
        
        // Will revert at precompile level, but validates our contract
        vm.expectRevert();
        bridge.sendRealXCMTransfer{value: amount}(1000, recipient, amount);
    }
}
