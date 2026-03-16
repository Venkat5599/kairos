// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {IntentRegistry} from "../src/IntentRegistry.sol";
import {IntentRouter} from "../src/IntentRouter.sol";
import {XCMBridge} from "../src/XCMBridgePolkadotHub.sol";

/**
 * @title DeployPolkadotHub
 * @notice Deployment script for Polkadot Hub TestNet
 * @dev Run with: forge script script/DeployPolkadotHub.s.sol:DeployPolkadotHub --rpc-url $RPC_URL --broadcast
 */
contract DeployPolkadotHub is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("==============================================");
        console.log("Deploying to Polkadot Hub TestNet");
        console.log("==============================================");
        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("Balance:", deployer.balance / 1e18, "PAS");
        console.log("");

        require(block.chainid == 420420417, "Wrong network! Must be Polkadot Hub TestNet (420420417)");
        require(deployer.balance > 0.1 ether, "Insufficient PAS balance. Get tokens from https://faucet.polkadot.io/");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy IntentRegistry
        console.log("Deploying IntentRegistry...");
        IntentRegistry intentRegistry = new IntentRegistry();
        console.log("IntentRegistry deployed at:", address(intentRegistry));
        console.log("");

        // 2. Deploy IntentRouter
        console.log("Deploying IntentRouter...");
        IntentRouter intentRouter = new IntentRouter(address(intentRegistry));
        console.log("IntentRouter deployed at:", address(intentRouter));
        console.log("");

        // 3. Deploy XCMBridge (Polkadot Hub version with native XCM precompile)
        console.log("Deploying XCMBridge (Polkadot Hub)...");
        XCMBridge xcmBridge = new XCMBridge(address(intentRegistry));
        console.log("XCMBridge deployed at:", address(xcmBridge));
        console.log("");

        // 4. Contracts are now deployed and ready to use
        console.log("All contracts deployed successfully!");
        console.log("");

        vm.stopBroadcast();

        // Print summary
        console.log("==============================================");
        console.log("DEPLOYMENT SUMMARY - Polkadot Hub TestNet");
        console.log("==============================================");
        console.log("Network: Polkadot Hub TestNet");
        console.log("Chain ID:", block.chainid);
        console.log("RPC URL: https://eth-rpc-testnet.polkadot.io/");
        console.log("Explorer: https://blockscout-testnet.polkadot.io/");
        console.log("");
        console.log("Deployed Contracts:");
        console.log("-------------------");
        console.log("IntentRegistry:", address(intentRegistry));
        console.log("IntentRouter:", address(intentRouter));
        console.log("XCMBridge:", address(xcmBridge));
        console.log("");
        console.log("XCM Precompile: 0x00000000000000000000000000000000000a0000");
        console.log("");
        console.log("Next Steps:");
        console.log("1. Update packages/frontend/.env.local with new addresses");
        console.log("2. Update packages/solver-bot/.env with new addresses");
        console.log("3. Update Vercel environment variables");
        console.log("4. Test XCM functionality");
        console.log("==============================================");
        console.log("");
        console.log("Environment Variables for .env.polkadot-hub:");
        console.log("INTENT_REGISTRY_ADDRESS=", address(intentRegistry));
        console.log("INTENT_ROUTER_ADDRESS=", address(intentRouter));
        console.log("XCM_BRIDGE_ADDRESS=", address(xcmBridge));
    }
}
