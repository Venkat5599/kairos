// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IIntent} from "../interfaces/IIntent.sol";

/**
 * @title IntentLib
 * @notice Library for intent-related utility functions
 */
library IntentLib {
    /**
     * @notice Generate a unique intent ID
     * @param creator Address of the intent creator
     * @param nonce Unique nonce for the creator
     * @return bytes32 Unique intent identifier
     */
    function generateIntentId(
        address creator,
        uint256 nonce
    ) internal view returns (bytes32) {
        // Use block.number and blockhash for better uniqueness and security
        // Add chain ID to prevent cross-chain collisions
        return keccak256(
            abi.encodePacked(
                creator,
                nonce,
                block.number,
                block.chainid,
                blockhash(block.number - 1)
            )
        );
    }

    /**
     * @notice Validate intent parameters
     * @param params Intent parameters to validate
     * @return bool True if valid
     */
    function validateIntentParams(
        IIntent.IntentParams memory params
    ) internal view returns (bool) {
        if (bytes(params.description).length == 0) return false;
        if (params.reward == 0) return false;
        if (params.deadline <= block.timestamp) return false;
        return true;
    }

    /**
     * @notice Check if intent is expired
     * @param intent Intent to check
     * @return bool True if expired
     */
    function isExpired(
        IIntent.Intent memory intent
    ) internal view returns (bool) {
        return block.timestamp > intent.deadline;
    }

    /**
     * @notice Check if intent can be executed
     * @param intent Intent to check
     * @return bool True if executable
     */
    function isExecutable(
        IIntent.Intent memory intent
    ) internal view returns (bool) {
        return intent.status == IIntent.IntentStatus.Pending &&
               !isExpired(intent);
    }

    /**
     * @notice Calculate solver reward with reputation bonus
     * @param baseReward Base reward amount
     * @param reputation Solver reputation score
     * @return uint256 Final reward amount
     */
    function calculateReward(
        uint256 baseReward,
        uint256 reputation
    ) internal pure returns (uint256) {
        // 1% bonus per 100 reputation points, max 20% bonus
        uint256 bonus = (reputation / 100) > 20 ? 20 : (reputation / 100);
        return baseReward + (baseReward * bonus / 100);
    }
}
