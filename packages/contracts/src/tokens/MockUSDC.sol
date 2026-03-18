// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Mock USDC token for testing on Polkadot Hub TestNet
 * @dev ERC20 token with 6 decimals to match real USDC
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private constant DECIMALS = 6;

    constructor() ERC20("USD Coin", "USDC") Ownable(msg.sender) {
        // Mint 1 million USDC to deployer for distribution
        _mint(msg.sender, 1_000_000 * 10**DECIMALS);
    }

    /**
     * @notice Returns 6 decimals to match real USDC
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Mint tokens for testing purposes
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint (in base units)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Faucet function - anyone can claim 1000 USDC for testing
     */
    function faucet() external {
        require(balanceOf(msg.sender) < 10_000 * 10**DECIMALS, "Already have enough USDC");
        _mint(msg.sender, 1_000 * 10**DECIMALS);
    }
}
