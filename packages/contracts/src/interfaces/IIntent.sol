// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IIntent
 * @notice Interface for intent-related structures and functions
 */
interface IIntent {
    enum IntentStatus {
        Pending,
        Executing,
        Completed,
        Failed,
        Cancelled
    }

    struct Intent {
        bytes32 id;
        address creator;
        string description;
        bytes data;
        uint256 reward;
        uint256 deadline;
        IntentStatus status;
        address solver;
        uint256 createdAt;
        uint256 executedAt;
        address rewardToken; // address(0) for native token, ERC20 address for tokens
    }

    struct IntentParams {
        string description;
        bytes data;
        uint256 reward;
        uint256 deadline;
        address rewardToken; // address(0) for native token, ERC20 address for tokens
    }

    event IntentCreated(
        bytes32 indexed intentId,
        address indexed creator,
        string description,
        uint256 reward,
        uint256 deadline
    );

    event IntentExecuting(
        bytes32 indexed intentId,
        address indexed solver
    );

    event IntentCompleted(
        bytes32 indexed intentId,
        address indexed solver,
        bytes result
    );

    event IntentFailed(
        bytes32 indexed intentId,
        address indexed solver,
        string reason
    );

    event IntentCancelled(
        bytes32 indexed intentId,
        address indexed creator
    );
}
