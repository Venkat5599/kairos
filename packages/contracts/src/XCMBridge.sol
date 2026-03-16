// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title IXtokens
 * @notice Interface for Moonbeam's Xtokens precompile
 * @dev Precompile address: 0x0000000000000000000000000000000000000804
 */
interface IXtokens {
    /**
     * @notice Transfer native token to another chain
     * @param currencyAddress Address of the currency (address(0) for native DEV)
     * @param amount Amount to transfer
     * @param destination Multilocation of destination
     * @param weight Weight for XCM execution
     */
    function transfer(
        address currencyAddress,
        uint256 amount,
        bytes memory destination,
        uint64 weight
    ) external;

    /**
     * @notice Transfer with fee
     * @param currencyAddress Address of the currency
     * @param amount Amount to transfer
     * @param fee Fee amount
     * @param destination Multilocation of destination
     * @param weight Weight for XCM execution
     */
    function transferWithFee(
        address currencyAddress,
        uint256 amount,
        uint256 fee,
        bytes memory destination,
        uint64 weight
    ) external;
}

/**
 * @title IXcmTransactor
 * @notice Interface for Moonbeam's XCM Transactor precompile
 * @dev Precompile address: 0x0000000000000000000000000000000000000806
 * Allows remote execution on other parachains (staking, governance, etc)
 */
interface IXcmTransactor {
    /**
     * @notice Execute remote call on another parachain
     * @param destination Multilocation of destination
     * @param weight Weight for execution
     * @param innerCall Encoded call data
     */
    function transactThroughSigned(
        bytes memory destination,
        uint64 weight,
        bytes memory innerCall
    ) external payable;
}

/**
 * @title XCMBridge
 * @notice Bridge contract for cross-chain message passing using XCM
 * @dev Handles cross-chain intent execution via Polkadot's XCM protocol
 * Uses Moonbeam's Xtokens precompile for REAL cross-chain transfers
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
    
    // Moonbeam Xtokens precompile address
    IXtokens public constant XTOKENS = IXtokens(0x0000000000000000000000000000000000000804);
    
    // Moonbeam XCM Transactor precompile for remote execution
    IXcmTransactor public constant XCM_TRANSACTOR = IXcmTransactor(0x0000000000000000000000000000000000000806);
    
    // Chain IDs for Polkadot ecosystem
    uint32 public constant POLKADOT_RELAY = 0;
    uint32 public constant ASSET_HUB = 1000;
    uint32 public constant MOONBEAM = 2004;
    uint32 public constant MOONRIVER = 2023;
    uint32 public constant ASTAR = 2006;
    
    // Supported tokens
    struct TokenInfo {
        address tokenAddress;
        string symbol;
        uint8 decimals;
        bool isSupported;
    }
    
    mapping(address => TokenInfo) public supportedTokens;
    address[] public tokenList;
    
    event TokenAdded(address indexed token, string symbol, uint8 decimals);
    event TokenRemoved(address indexed token);
    event MultiTokenTransfer(
        address indexed token,
        uint32 indexed destinationChain,
        bytes32 recipient,
        uint256 amount
    );

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
        supportedChains[POLKADOT_RELAY] = true; // Polkadot Relay Chain
        supportedChains[ASSET_HUB] = true; // Asset Hub
        supportedChains[MOONBEAM] = true; // Moonbeam
        supportedChains[MOONRIVER] = true; // Moonriver
        supportedChains[ASTAR] = true; // Astar
        
        // Initialize native token (DEV) as supported
        supportedTokens[address(0)] = TokenInfo({
            tokenAddress: address(0),
            symbol: "DEV",
            decimals: 18,
            isSupported: true
        });
        tokenList.push(address(0));
    }

    /**
     * @notice Send cross-chain message via XCM (generic message tracking)
     * @param destinationChain Target parachain ID
     * @param payload Message payload
     * @param gasLimit Gas limit for execution
     * @return messageId Unique message identifier
     * @dev For REAL XCM transfers, use sendRealXCMTransfer() which calls Xtokens precompile.
     * This function provides generic message tracking for future extensibility.
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
     * @dev This is a generic message-passing function for future extensibility.
     * For REAL XCM transfers, use sendRealXCMTransfer(), stakeOnPolkadot(), or voteOnPolkadot()
     * which directly call Moonbeam's Xtokens and XCM Transactor precompiles.
     */
    function _executeXCMTransfer(
        bytes32 messageId,
        uint32 destinationChain,
        bytes calldata payload
    ) internal {
        messages[messageId].status = MessageStatus.Sent;
        // Generic message tracking - actual XCM execution happens in sendRealXCMTransfer()
    }

    /**
     * @notice Send REAL XCM transfer using Xtokens precompile
     * @param destinationChain Target parachain ID (0=Relay, 1000=AssetHub, etc)
     * @param recipient Recipient address on destination chain
     * @param amount Amount to transfer in wei
     * @return success Whether transfer was initiated
     */
    function sendRealXCMTransfer(
        uint32 destinationChain,
        bytes32 recipient,
        uint256 amount
    ) external payable returns (bool success) {
        return sendRealXCMTransferWithToken(address(0), destinationChain, recipient, amount);
    }
    
    /**
     * @notice Send REAL XCM transfer with specific token using Xtokens precompile
     * @param token Token address (address(0) for native DEV)
     * @param destinationChain Target parachain ID
     * @param recipient Recipient address on destination chain
     * @param amount Amount to transfer
     * @return success Whether transfer was initiated
     */
    function sendRealXCMTransferWithToken(
        address token,
        uint32 destinationChain,
        bytes32 recipient,
        uint256 amount
    ) public payable returns (bool success) {
        require(supportedChains[destinationChain], "Chain not supported");
        require(supportedTokens[token].isSupported, "Token not supported");
        require(amount > 0, "Amount must be > 0");
        
        if (token == address(0)) {
            // Native token transfer
            require(msg.value >= amount, "Insufficient value sent");
        } else {
            // ERC20 token transfer
            require(msg.value >= BASE_FEE, "Insufficient fee");
            // Transfer tokens from sender to this contract
            (bool transferSuccess, ) = token.call(
                abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), amount)
            );
            require(transferSuccess, "Token transfer failed");
            
            // Approve Xtokens precompile to spend tokens
            (bool approveSuccess, ) = token.call(
                abi.encodeWithSignature("approve(address,uint256)", address(XTOKENS), amount)
            );
            require(approveSuccess, "Token approval failed");
        }
        
        // Build multilocation for destination
        bytes memory destination = _buildMultilocation(destinationChain, recipient);
        
        // XCM weight for execution
        uint64 weight = 4_000_000_000;
        
        // Call Xtokens precompile to execute REAL cross-chain transfer
        try XTOKENS.transfer(
            token, // Token address (address(0) for native)
            amount,
            destination,
            weight
        ) {
            emit MultiTokenTransfer(token, destinationChain, recipient, amount);
            emit XCMMessageSent(
                keccak256(abi.encodePacked(msg.sender, token, destinationChain, recipient, block.timestamp)),
                destinationChain,
                abi.encodePacked(recipient, amount),
                msg.value
            );
            return true;
        } catch {
            // Refund on failure
            if (token == address(0)) {
                payable(msg.sender).transfer(msg.value);
            } else {
                // Return tokens to sender
                (bool refundSuccess, ) = token.call(
                    abi.encodeWithSignature("transfer(address,uint256)", msg.sender, amount)
                );
                require(refundSuccess, "Refund failed");
                payable(msg.sender).transfer(msg.value);
            }
            return false;
        }
    }
    
    /**
     * @notice Build multilocation for XCM destination
     * @param paraId Parachain ID (0 for relay chain)
     * @param recipient Recipient account as bytes32
     * @return Encoded multilocation
     */
    function _buildMultilocation(
        uint32 paraId,
        bytes32 recipient
    ) internal pure returns (bytes memory) {
        // Multilocation structure for Polkadot ecosystem:
        // {
        //   parents: 1,  // Go up to relay chain
        //   interior: X2(
        //     Parachain(paraId),
        //     AccountId32 { id: recipient, network: None }
        //   )
        // }
        
        if (paraId == 0) {
            // Relay chain destination
            // {parents: 1, interior: X1(AccountId32)}
            return abi.encodePacked(
                uint8(1),  // parents
                uint8(1),  // X1
                uint8(1),  // AccountId32
                recipient,
                uint8(0)   // network: None
            );
        } else {
            // Parachain destination
            // {parents: 1, interior: X2(Parachain, AccountId32)}
            return abi.encodePacked(
                uint8(1),  // parents
                uint8(2),  // X2
                uint8(0),  // Parachain
                paraId,
                uint8(1),  // AccountId32
                recipient,
                uint8(0)   // network: None
            );
        }
    }

    /**
     * @notice Execute remote staking on Polkadot Relay Chain via XCM Transactor
     * @param validator Validator address to nominate (bytes32)
     * @param amount Amount to stake
     * @return success Whether the remote call was initiated
     * @dev Uses XCM Transactor precompile for remote execution
     */
    function stakeOnPolkadot(
        bytes32 validator,
        uint256 amount
    ) external payable returns (bool success) {
        require(amount > 0, "Amount must be > 0");
        require(msg.value >= amount, "Insufficient value");
        
        // Build destination multilocation for Polkadot Relay Chain
        bytes memory destination = abi.encodePacked(
            uint8(1),  // parents: 1 (relay chain)
            uint8(0)   // interior: Here
        );
        
        // Encode staking call for Polkadot
        // Staking pallet index: 6
        // nominate() call index: 5
        bytes memory innerCall = abi.encodePacked(
            uint8(6),   // Staking pallet
            uint8(5),   // nominate() function
            validator   // Validator to nominate
        );
        
        // Execute remote staking via XCM Transactor
        uint64 weight = 5_000_000_000; // 5 billion weight units
        
        try XCM_TRANSACTOR.transactThroughSigned{value: msg.value}(
            destination,
            weight,
            innerCall
        ) {
            emit XCMMessageSent(
                keccak256(abi.encodePacked(msg.sender, "stake", validator, block.timestamp)),
                POLKADOT_RELAY,
                innerCall,
                msg.value
            );
            return true;
        } catch {
            payable(msg.sender).transfer(msg.value);
            return false;
        }
    }

    /**
     * @notice Execute remote governance vote on Polkadot via XCM Transactor
     * @param referendumIndex Index of the referendum
     * @param vote Vote (true = Aye, false = Nay)
     * @param conviction Conviction multiplier (0-6)
     * @return success Whether the remote call was initiated
     */
    function voteOnPolkadot(
        uint32 referendumIndex,
        bool vote,
        uint8 conviction
    ) external payable returns (bool success) {
        require(conviction <= 6, "Invalid conviction");
        require(msg.value > 0, "Need fee for XCM");
        
        // Build destination for relay chain
        bytes memory destination = abi.encodePacked(
            uint8(1),  // parents: 1
            uint8(0)   // interior: Here
        );
        
        // Encode governance vote call
        // Democracy pallet index: 14
        // vote() call index: 1
        bytes memory innerCall = abi.encodePacked(
            uint8(14),          // Democracy pallet
            uint8(1),           // vote() function
            referendumIndex,    // Referendum index
            vote ? uint8(1) : uint8(0),  // Vote
            conviction          // Conviction
        );
        
        uint64 weight = 4_000_000_000;
        
        try XCM_TRANSACTOR.transactThroughSigned{value: msg.value}(
            destination,
            weight,
            innerCall
        ) {
            emit XCMMessageSent(
                keccak256(abi.encodePacked(msg.sender, "vote", referendumIndex, block.timestamp)),
                POLKADOT_RELAY,
                innerCall,
                msg.value
            );
            return true;
        } catch {
            payable(msg.sender).transfer(msg.value);
            return false;
        }
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
    
    /**
     * @notice Add supported token
     * @param token Token address
     * @param symbol Token symbol
     * @param decimals Token decimals
     */
    function addSupportedToken(
        address token,
        string calldata symbol,
        uint8 decimals
    ) external onlyOwner {
        require(!supportedTokens[token].isSupported, "Token already supported");
        
        supportedTokens[token] = TokenInfo({
            tokenAddress: token,
            symbol: symbol,
            decimals: decimals,
            isSupported: true
        });
        
        tokenList.push(token);
        emit TokenAdded(token, symbol, decimals);
    }
    
    /**
     * @notice Remove supported token
     * @param token Token address
     */
    function removeSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Cannot remove native token");
        require(supportedTokens[token].isSupported, "Token not supported");
        
        supportedTokens[token].isSupported = false;
        emit TokenRemoved(token);
    }
    
    /**
     * @notice Get all supported tokens
     * @return Array of token addresses
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return tokenList;
    }
    
    /**
     * @notice Get token info
     * @param token Token address
     * @return TokenInfo struct
     */
    function getTokenInfo(address token) external view returns (TokenInfo memory) {
        return supportedTokens[token];
    }
    
    /**
     * @notice Check if token is supported
     * @param token Token address
     * @return bool
     */
    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens[token].isSupported;
    }

    receive() external payable {}
}
