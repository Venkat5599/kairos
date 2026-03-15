// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IIntent} from "./interfaces/IIntent.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title IntentRouter
 * @notice Routes intents to appropriate execution strategies
 * @dev Determines optimal execution path based on intent type and data
 */
contract IntentRouter is Ownable {
    enum RouteType {
        Direct,
        Swap,
        CrossChain,
        Complex
    }

    struct Route {
        RouteType routeType;
        address[] path;
        uint256 estimatedGas;
        uint256 estimatedTime;
        bytes additionalData;
    }

    event RouteCalculated(
        bytes32 indexed intentId,
        RouteType routeType,
        uint256 estimatedGas
    );

    event RouteExecuted(
        bytes32 indexed intentId,
        address indexed executor,
        bool success
    );

    mapping(bytes32 => Route) public routes;
    address public intentRegistry;

    modifier onlyRegistry() {
        require(msg.sender == intentRegistry, "Only registry can call");
        _;
    }

    constructor(address _intentRegistry) Ownable(msg.sender) {
        intentRegistry = _intentRegistry;
    }

    /**
     * @notice Calculate optimal route for an intent
     * @param intentId Intent identifier
     * @param intentData Intent execution data
     * @return route Calculated route information
     */
    function calculateRoute(
        bytes32 intentId,
        bytes calldata intentData
    ) external returns (Route memory route) {
        // Parse intent data to determine route type
        RouteType routeType = _determineRouteType(intentData);

        route = Route({
            routeType: routeType,
            path: _calculatePath(routeType, intentData),
            estimatedGas: _estimateGas(routeType),
            estimatedTime: _estimateTime(routeType),
            additionalData: intentData
        });

        routes[intentId] = route;

        emit RouteCalculated(intentId, routeType, route.estimatedGas);

        return route;
    }

    /**
     * @notice Get route for an intent
     * @param intentId Intent identifier
     * @return Route information
     */
    function getRoute(bytes32 intentId) external view returns (Route memory) {
        return routes[intentId];
    }

    /**
     * @notice Determine route type from intent data
     * @param intentData Intent execution data
     * @return RouteType
     */
    function _determineRouteType(
        bytes calldata intentData
    ) internal pure returns (RouteType) {
        // Simple heuristic: check data length and patterns
        if (intentData.length == 0) return RouteType.Direct;

        // Check for cross-chain indicators (simplified)
        bytes4 selector = bytes4(intentData[:4]);

        if (selector == bytes4(keccak256("crossChain()"))) {
            return RouteType.CrossChain;
        } else if (selector == bytes4(keccak256("swap()"))) {
            return RouteType.Swap;
        } else if (intentData.length > 256) {
            return RouteType.Complex;
        }

        return RouteType.Direct;
    }

    /**
     * @notice Calculate execution path
     * @param routeType Type of route
     * @param intentData Intent data
     * @return path Array of addresses in execution path
     */
    function _calculatePath(
        RouteType routeType,
        bytes calldata intentData
    ) internal pure returns (address[] memory path) {
        // Path calculation for routing optimization
        // Returns empty path array as actual routing is handled by solver bots
        if (routeType == RouteType.Direct) {
            path = new address[](1);
            path[0] = address(0); // Direct execution, no intermediaries
        } else if (routeType == RouteType.Swap) {
            path = new address[](2);
            // Swap paths decoded by solver from intentData
        } else {
            path = new address[](3);
            // Complex multi-hop paths handled by solver
        }

        return path;
    }

    /**
     * @notice Estimate gas for route type
     * @param routeType Type of route
     * @return Estimated gas
     */
    function _estimateGas(RouteType routeType) internal pure returns (uint256) {
        if (routeType == RouteType.Direct) return 50000;
        if (routeType == RouteType.Swap) return 150000;
        if (routeType == RouteType.CrossChain) return 300000;
        return 500000; // Complex
    }

    /**
     * @notice Estimate execution time
     * @param routeType Type of route
     * @return Estimated time in seconds
     */
    function _estimateTime(RouteType routeType) internal pure returns (uint256) {
        if (routeType == RouteType.Direct) return 15;
        if (routeType == RouteType.Swap) return 30;
        if (routeType == RouteType.CrossChain) return 120;
        return 300; // Complex
    }

    /**
     * @notice Update intent registry address
     * @param _intentRegistry New registry address
     */
    function updateRegistry(address _intentRegistry) external onlyOwner {
        require(_intentRegistry != address(0), "Invalid address");
        intentRegistry = _intentRegistry;
    }
}
