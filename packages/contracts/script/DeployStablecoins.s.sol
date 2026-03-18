// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/tokens/MockUSDC.sol";
import "../src/tokens/MockUSDT.sol";
import "../src/IntentRegistry.sol";

contract DeployStablecoins is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address intentRegistryAddress = vm.envAddress("INTENT_REGISTRY_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy MockUSDC
        MockUSDC usdc = new MockUSDC();
        console.log("MockUSDC deployed at:", address(usdc));

        // Deploy MockUSDT
        MockUSDT usdt = new MockUSDT();
        console.log("MockUSDT deployed at:", address(usdt));

        // Add tokens to IntentRegistry supported tokens
        IntentRegistry intentRegistry = IntentRegistry(payable(intentRegistryAddress));

        intentRegistry.addSupportedToken(address(usdc));
        console.log("Added USDC to supported tokens");

        intentRegistry.addSupportedToken(address(usdt));
        console.log("Added USDT to supported tokens");

        // Mint some tokens to deployer for testing
        usdc.mint(msg.sender, 1_000_000 * 10**6); // 1M USDC
        usdt.mint(msg.sender, 1_000_000 * 10**6); // 1M USDT
        console.log("Minted test tokens to deployer");

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("MockUSDC:", address(usdc));
        console.log("MockUSDT:", address(usdt));
        console.log("IntentRegistry:", intentRegistryAddress);
        console.log("\nAdd these to your .env:");
        console.log("NEXT_PUBLIC_MOCK_USDC_ADDRESS=", address(usdc));
        console.log("NEXT_PUBLIC_MOCK_USDT_ADDRESS=", address(usdt));
    }
}
