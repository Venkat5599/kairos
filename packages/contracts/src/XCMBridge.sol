// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title XCMBridge
 * @notice Bridge contract for cross-chain message passing using XCM
 * @dev Handles cross-chain intent execution via Polkadot's XCM protocol
 */
contract XCMBridge is Ownable {
    struct XCMMessage {
        address sender;
        uint32 destinationChain;
        bytes payload;
        uint256 gasLimit;
        uint256 fee;
        uint256 timestamp;
        MessageStatus status;
    }

    enum MessageStatus {
        Pending,
        Sent,
        Delivered,
        Failed
    }

    event XCMMessageSent(
        bytes32 indexed messageId,
        uint32 indexed destinationChain,
        bytes payload,
        uint256 fee
    );

    event XCMMessageDelivered(
        bytes32 indexed messageId,
        uint32 indexed sourceChain
    );

    event XCMMessageFailed(
        bytes32 indexed messageId,
        string reason
    );

    mapping(bytes32 => XCMMessage) public messages;
    mapping(uint32 => bool) public supportedChains;
    mapping(address => bool) public relayers;

    address public intentRegistry;
    uint256 public constant BASE_FEE = 0.01 ether;

    modifier onlyRegistry() {
        require(msg.sender == intentRegistry, "Only registry");
        _;
    }

    modifier onlyRelayer() {
        require(relayers[msg.sender], "Only relayer");
        _;
    }

    constructor(address _intentRegistry) Ownable(msg.sender) {
        intentRegistry = _intentRegistry;

        // Initialize supported chains (Polkadot parachains)
        supportedChains[1000] = true; // Asset Hub
        supportedChains[2000] = true; // Moonbeam
        supportedChains[2004] = true; // Moonriver
    }

    /**
     * @notice Send cross-chain message via XCM
     * @param destinationChain Target parachain ID
     * @param payload Message payload
     * @param gasLimit Gas limit for execution
     * @return messageId Unique message identifier
     */
    function sendXCMMessage(
        uint32 destinationChain,
        bytes calldata payload,
        uint256 gasLimit
    ) external payable returns (bytes32 messageId) {
        require(supportedChains[destinationChain], "Chain not supported");
        require(msg.value >= BASE_FEE, "Insufficient fee");
        require(payload.length > 0, "Empty payload");

        messageId = keccak256(
            abi.encodePacked(
                msg.sender,
                destinationChain,
                payload,
                block.timestamp
            )
        );

        messages[messageId] = XCMMessage({
            sender: msg.sender,
            destinationChain: destinationChain,
            payload: payload,
            gasLimit: gasLimit,
            fee: msg.value,
            timestamp: block.timestamp,
            status: MessageStatus.Pending
        });

        // In production, this would interact with XCM precompile
        // For now, we emit event for off-chain processing
        _executeXCMTransfer(messageId, destinationChain, payload);

        emit XCMMessageSent(messageId, destinationChain, payload, msg.value);

        return messageId;
    }

    /**
     * @notice Confirm message delivery (called by relayer)
     * @param messageId Message identifier
     */
    function confirmDelivery(
        bytes32 messageId,
        uint32 sourceChain
    ) external onlyRelayer {
        XCMMessage storage message = messages[messageId];
        require(message.timestamp > 0, "Message not found");
        require(
            message.status == MessageStatus.Sent,
            "Invalid status"
        );

        message.status = MessageStatus.Delivered;

        emit XCMMessageDelivered(messageId, sourceChain);
    }

    /**
     * @notice Mark message as failed
     * @param messageId Message identifier
     * @param reason Failure reason
     */
    function markFailed(
        bytes32 messageId,
        string calldata reason
    ) external onlyRelayer {
        XCMMessage storage message = messages[messageId];
        require(message.timestamp > 0, "Message not found");
        require(
            message.status == MessageStatus.Sent ||
            message.status == MessageStatus.Pending,
            "Invalid status"
        );

        message.status = MessageStatus.Failed;

        // Refund fee to original sender
        payable(message.sender).transfer(message.fee);

        emit XCMMessageFailed(messageId, reason);
    }

    /**
     * @notice Execute XCM transfer (internal)
     * @param messageId Message identifier
     * @param destinationChain Target chain
     * @param payload Message payload
     */
    function _executeXCMTransfer(
        bytes32 messageId,
        uint32 destinationChain,
        bytes calldata payload
    ) internal {
        // This is a simplified implementation
        // In production, would use XCM precompile or pallet

        messages[messageId].status = MessageStatus.Sent;

        // Placeholder for actual XCM execution
        // Would call: xcmTransactor.transactThroughSigned(...)
    }

    /**
     * @notice Add supported chain
     * @param chainId Parachain ID
     */
    function addSupportedChain(uint32 chainId) external onlyOwner {
        supportedChains[chainId] = true;
    }

    /**
     * @notice Remove supported chain
     * @param chainId Parachain ID
     */
    function removeSupportedChain(uint32 chainId) external onlyOwner {
        supportedChains[chainId] = false;
    }

    /**
     * @notice Get message details
     * @param messageId Message identifier
     * @return XCMMessage struct
     */
    function getMessage(
        bytes32 messageId
    ) external view returns (XCMMessage memory) {
        return messages[messageId];
    }

    /**
     * @notice Check if chain is supported
     * @param chainId Parachain ID
     * @return bool
     */
    function isChainSupported(uint32 chainId) external view returns (bool) {
        return supportedChains[chainId];
    }

    /**
     * @notice Update intent registry
     * @param _intentRegistry New registry address
     */
    function updateRegistry(address _intentRegistry) external onlyOwner {
        require(_intentRegistry != address(0), "Invalid address");
        intentRegistry = _intentRegistry;
    }

    /**
     * @notice Add relayer
     * @param relayer Relayer address
     */
    function addRelayer(address relayer) external onlyOwner {
        require(relayer != address(0), "Invalid address");
        relayers[relayer] = true;
    }

    /**
     * @notice Remove relayer
     * @param relayer Relayer address
     */
    function removeRelayer(address relayer) external onlyOwner {
        relayers[relayer] = false;
    }

    receive() external payable {}
}
