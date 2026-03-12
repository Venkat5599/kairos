// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ISolver
 * @notice Interface for solver registration and management
 */
interface ISolver {
    struct SolverInfo {
        address solverAddress;
        uint256 stake;
        uint256 reputation;
        uint256 totalExecuted;
        uint256 totalFailed;
        bool isActive;
        uint256 registeredAt;
    }

    event SolverRegistered(
        address indexed solver,
        uint256 stake
    );

    event SolverDeregistered(
        address indexed solver
    );

    event SolverSlashed(
        address indexed solver,
        uint256 amount,
        string reason
    );

    event RewardClaimed(
        address indexed solver,
        uint256 amount
    );

    function registerSolver() external payable;
    function deregisterSolver() external;
    function claimReward(bytes32 intentId) external;
    function getSolverInfo(address solver) external view returns (SolverInfo memory);
}
