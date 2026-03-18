// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IIntent} from "./interfaces/IIntent.sol";
import {ISolver} from "./interfaces/ISolver.sol";
import {IntentLib} from "./libraries/IntentLib.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "openzeppelin-contracts/contracts/utils/Pausable.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title IntentRegistry
 * @notice Core contract for managing user intents
 * @dev Stores intents, manages lifecycle, and coordinates with solvers
 */
contract IntentRegistry is IIntent, ISolver, ReentrancyGuard, Pausable, Ownable {
    using IntentLib for IIntent.Intent;
    using IntentLib for IIntent.IntentParams;
    using SafeERC20 for IERC20;

    // State variables
    mapping(bytes32 => Intent) public intents;
    mapping(address => uint256) public userNonces;
    mapping(address => SolverInfo) public solvers;
    mapping(address => uint256) public pendingRewards;
    mapping(address => bool) public supportedTokens; // Supported ERC20 tokens

    bytes32[] public intentIds;
    uint256 public constant MIN_STAKE = 1 ether;
    uint256 public constant SLASH_AMOUNT = 0.1 ether;

    // Modifiers
    modifier onlyActiveSolver() {
        require(solvers[msg.sender].isActive, "Not an active solver");
        _;
    }

    modifier intentExists(bytes32 intentId) {
        require(intents[intentId].creator != address(0), "Intent does not exist");
        _;
    }

    constructor() Ownable(msg.sender) {
        // Initialize with deployer as owner
    }

    /**
     * @notice Create a new intent
     * @param params Intent parameters
     * @return intentId Unique identifier for the created intent
     */
    function createIntent(
        IntentParams calldata params
    ) external payable whenNotPaused returns (bytes32 intentId) {
        require(params.validateIntentParams(), "Invalid intent parameters");

        // Handle native token (address(0)) or ERC20 token
        if (params.rewardToken == address(0)) {
            require(msg.value >= params.reward, "Insufficient reward");
        } else {
            require(supportedTokens[params.rewardToken], "Token not supported");
            require(msg.value == 0, "Do not send native token with ERC20 intent");
            // Transfer ERC20 tokens from creator to contract
            IERC20(params.rewardToken).safeTransferFrom(msg.sender, address(this), params.reward);
        }

        intentId = IntentLib.generateIntentId(msg.sender, userNonces[msg.sender]++);

        intents[intentId] = Intent({
            id: intentId,
            creator: msg.sender,
            description: params.description,
            data: params.data,
            reward: params.reward,
            deadline: params.deadline,
            status: IntentStatus.Pending,
            solver: address(0),
            createdAt: block.timestamp,
            executedAt: 0,
            rewardToken: params.rewardToken
        });

        intentIds.push(intentId);

        emit IntentCreated(
            intentId,
            msg.sender,
            params.description,
            params.reward,
            params.deadline
        );

        return intentId;
    }

    /**
     * @notice Solver claims an intent for execution
     * @param intentId Intent to execute
     */
    function executeIntent(
        bytes32 intentId
    ) external onlyActiveSolver whenNotPaused intentExists(intentId) {
        Intent storage intent = intents[intentId];
        require(intent.isExecutable(), "Intent not executable");

        intent.status = IntentStatus.Executing;
        intent.solver = msg.sender;

        emit IntentExecuting(intentId, msg.sender);
    }

    /**
     * @notice Mark intent as completed
     * @param intentId Intent identifier
     * @param result Execution result data
     */
    function completeIntent(
        bytes32 intentId,
        bytes calldata result
    ) external onlyActiveSolver whenNotPaused nonReentrant intentExists(intentId) {
        Intent storage intent = intents[intentId];
        require(intent.status == IntentStatus.Executing, "Intent not executing");
        require(intent.solver == msg.sender, "Not the assigned solver");

        intent.status = IntentStatus.Completed;
        intent.executedAt = block.timestamp;

        // Calculate reward with reputation bonus
        uint256 reward = IntentLib.calculateReward(
            intent.reward,
            solvers[msg.sender].reputation
        );

        // Transfer reward based on token type
        if (intent.rewardToken == address(0)) {
            // Native token reward
            pendingRewards[msg.sender] += reward;
        } else {
            // ERC20 token reward - transfer directly to solver
            IERC20(intent.rewardToken).safeTransfer(msg.sender, reward);
        }

        solvers[msg.sender].totalExecuted++;
        solvers[msg.sender].reputation += 10;

        emit IntentCompleted(intentId, msg.sender, result);
    }

    /**
     * @notice Mark intent as failed
     * @param intentId Intent identifier
     * @param reason Failure reason
     */
    function failIntent(
        bytes32 intentId,
        string calldata reason
    ) external onlyActiveSolver intentExists(intentId) {
        Intent storage intent = intents[intentId];
        require(intent.status == IntentStatus.Executing, "Intent not executing");
        require(intent.solver == msg.sender, "Not the assigned solver");

        intent.status = IntentStatus.Failed;
        intent.solver = address(0);

        solvers[msg.sender].totalFailed++;

        // Slash solver stake for failure
        if (solvers[msg.sender].stake >= SLASH_AMOUNT) {
            solvers[msg.sender].stake -= SLASH_AMOUNT;
            emit SolverSlashed(msg.sender, SLASH_AMOUNT, reason);
        }

        emit IntentFailed(intentId, msg.sender, reason);
    }

    /**
     * @notice Cancel an intent (only creator)
     * @param intentId Intent to cancel
     */
    function cancelIntent(
        bytes32 intentId
    ) external whenNotPaused nonReentrant intentExists(intentId) {
        Intent storage intent = intents[intentId];
        require(intent.creator == msg.sender, "Not intent creator");
        require(intent.status == IntentStatus.Pending, "Cannot cancel");

        intent.status = IntentStatus.Cancelled;

        // Refund reward to creator based on token type
        if (intent.rewardToken == address(0)) {
            // Native token refund
            payable(msg.sender).transfer(intent.reward);
        } else {
            // ERC20 token refund
            IERC20(intent.rewardToken).safeTransfer(msg.sender, intent.reward);
        }

        emit IntentCancelled(intentId, msg.sender);
    }

    /**
     * @notice Register as a solver
     */
    function registerSolver() external payable override whenNotPaused {
        require(!solvers[msg.sender].isActive, "Already registered");
        require(msg.value >= MIN_STAKE, "Insufficient stake");

        solvers[msg.sender] = SolverInfo({
            solverAddress: msg.sender,
            stake: msg.value,
            reputation: 0,
            totalExecuted: 0,
            totalFailed: 0,
            isActive: true,
            registeredAt: block.timestamp
        });

        emit SolverRegistered(msg.sender, msg.value);
    }

    /**
     * @notice Deregister as a solver
     */
    function deregisterSolver() external override nonReentrant {
        require(solvers[msg.sender].isActive, "Not registered");

        solvers[msg.sender].isActive = false;

        // Return stake
        uint256 stake = solvers[msg.sender].stake;
        if (stake > 0) {
            payable(msg.sender).transfer(stake);
        }

        emit SolverDeregistered(msg.sender);
    }

    /**
     * @notice Claim accumulated rewards
     * @param intentId Intent identifier (unused, for interface compatibility)
     */
    function claimReward(bytes32 intentId) external override nonReentrant {
        uint256 reward = pendingRewards[msg.sender];
        require(reward > 0, "No rewards to claim");

        pendingRewards[msg.sender] = 0;
        payable(msg.sender).transfer(reward);

        emit RewardClaimed(msg.sender, reward);
    }

    /**
     * @notice Get intent details
     * @param intentId Intent identifier
     * @return Intent struct
     */
    function getIntent(bytes32 intentId) external view returns (Intent memory) {
        return intents[intentId];
    }

    /**
     * @notice Get solver information
     * @param solver Solver address
     * @return SolverInfo struct
     */
    function getSolverInfo(
        address solver
    ) external view override returns (SolverInfo memory) {
        return solvers[solver];
    }

    /**
     * @notice Get all intent IDs
     * @return Array of intent IDs
     */
    function getAllIntentIds() external view returns (bytes32[] memory) {
        return intentIds;
    }

    /**
     * @notice Get pending intents count
     * @return count Number of pending intents
     */
    function getPendingIntentsCount() external view returns (uint256 count) {
        for (uint256 i = 0; i < intentIds.length; i++) {
            if (intents[intentIds[i]].status == IntentStatus.Pending) {
                count++;
            }
        }
    }

    /**
     * @notice Pause contract (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Add a supported ERC20 token for rewards
     * @param token Token address to add
     */
    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        supportedTokens[token] = true;
    }

    /**
     * @notice Remove a supported ERC20 token
     * @param token Token address to remove
     */
    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
    }

    /**
     * @notice Check if a token is supported
     * @param token Token address to check
     * @return bool True if token is supported
     */
    function isTokenSupported(address token) external view returns (bool) {
        return token == address(0) || supportedTokens[token];
    }
}
