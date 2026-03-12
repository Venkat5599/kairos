// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/IntentRouter.sol";
import "../src/IntentRegistry.sol";

contract IntentRouterTest is Test {
    IntentRouter public router;
    IntentRegistry public registry;

    address public owner = address(this);
    address public user = address(0x1);

    function setUp() public {
        registry = new IntentRegistry();
        router = new IntentRouter(address(registry));
    }

    function testCalculateDirectRoute() public {
        bytes memory intentData = "";
        bytes32 intentId = keccak256("test");

        IntentRouter.Route memory route = router.calculateRoute(intentId, intentData);

        assertEq(uint(route.routeType), uint(IntentRouter.RouteType.Direct));
        assertEq(route.estimatedGas, 50000);
        assertEq(route.estimatedTime, 15);
    }

    function testCalculateSwapRoute() public {
        bytes memory intentData = abi.encodeWithSignature("swap()");
        bytes32 intentId = keccak256("test");

        IntentRouter.Route memory route = router.calculateRoute(intentId, intentData);

        assertEq(uint(route.routeType), uint(IntentRouter.RouteType.Swap));
        assertEq(route.estimatedGas, 150000);
        assertEq(route.estimatedTime, 30);
    }

    function testCalculateCrossChainRoute() public {
        bytes memory intentData = abi.encodeWithSignature("crossChain()");
        bytes32 intentId = keccak256("test");

        IntentRouter.Route memory route = router.calculateRoute(intentId, intentData);

        assertEq(uint(route.routeType), uint(IntentRouter.RouteType.CrossChain));
        assertEq(route.estimatedGas, 300000);
        assertEq(route.estimatedTime, 120);
    }

    function testCalculateComplexRoute() public {
        bytes memory intentData = new bytes(300);
        bytes32 intentId = keccak256("test");

        IntentRouter.Route memory route = router.calculateRoute(intentId, intentData);

        assertEq(uint(route.routeType), uint(IntentRouter.RouteType.Complex));
        assertEq(route.estimatedGas, 500000);
        assertEq(route.estimatedTime, 300);
    }

    function testGetRoute() public {
        bytes memory intentData = abi.encodeWithSignature("swap()");
        bytes32 intentId = keccak256("test");

        router.calculateRoute(intentId, intentData);
        IntentRouter.Route memory route = router.getRoute(intentId);

        assertEq(uint(route.routeType), uint(IntentRouter.RouteType.Swap));
    }

    function testUpdateRegistryOnlyOwner() public {
        address newRegistry = address(0x123);

        router.updateRegistry(newRegistry);
        assertEq(router.intentRegistry(), newRegistry);
    }

    function testFailUpdateRegistryNotOwner() public {
        vm.prank(user);
        router.updateRegistry(address(0x123));
    }

    function testFailUpdateRegistryZeroAddress() public {
        router.updateRegistry(address(0));
    }

    function testRouteCalculationEmitsEvent() public {
        bytes memory intentData = abi.encodeWithSignature("swap()");
        bytes32 intentId = keccak256("test");

        vm.expectEmit(true, false, false, true);
        emit IntentRouter.RouteCalculated(intentId, IntentRouter.RouteType.Swap, 150000);

        router.calculateRoute(intentId, intentData);
    }

    function testFuzzRouteCalculation(bytes calldata intentData) public {
        bytes32 intentId = keccak256(abi.encodePacked(intentData));

        IntentRouter.Route memory route = router.calculateRoute(intentId, intentData);

        // Verify route type is valid
        assertTrue(uint(route.routeType) <= uint(IntentRouter.RouteType.Complex));

        // Verify gas estimates are reasonable
        assertTrue(route.estimatedGas >= 50000 && route.estimatedGas <= 500000);

        // Verify time estimates are reasonable
        assertTrue(route.estimatedTime >= 15 && route.estimatedTime <= 300);
    }
}
