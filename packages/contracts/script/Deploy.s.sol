// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/IntentRegistry.sol";
import "../src/IntentRouter.sol";
import "../src/XCMBridge.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy contracts
        IntentRegistry registry = new IntentRegistry();
        console.log("IntentRegistry deployed at:", address(registry));

        IntentRouter router = new IntentRouter(address(registry));
        console.log("IntentRouter deployed at:", address(router));

        XCMBridge bridge = new XCMBridge(address(registry));
        console.log("XCMBridge deployed at:", address(bridge));

        vm.stopBroadcast();

        // Save deployment addresses
        string memory deploymentInfo = string(
            abi.encodePacked(
                "INTENT_REGISTRY_ADDRESS=", vm.toString(address(registry)), "\n",
                "INTENT_ROUTER_ADDRESS=", vm.toString(address(router)), "\n",
                "XCM_BRIDGE_ADDRESS=", vm.toString(address(bridge)), "\n"
            )
        );

        vm.writeFile(".env.deployed", deploymentInfo);
        console.log("\nDeployment addresses saved to .env.deployed");
    }
}
