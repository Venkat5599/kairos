// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/NameRegistry.sol";

contract DeployNameRegistry is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        NameRegistry nameRegistry = new NameRegistry();
        console.log("NameRegistry deployed at:", address(nameRegistry));

        vm.stopBroadcast();

        // Save deployment address
        string memory deploymentInfo = string(
            abi.encodePacked(
                "NAME_REGISTRY_ADDRESS=", vm.toString(address(nameRegistry)), "\n"
            )
        );

        vm.writeFile(".env.nameregistry", deploymentInfo);
        console.log("\nDeployment address saved to .env.nameregistry");
    }
}
