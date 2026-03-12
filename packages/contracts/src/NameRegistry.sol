// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title NameRegistry
 * @notice Decentralized name registry for human-readable addresses
 * @dev Allows users to register unique names linked to their wallet addresses
 */
contract NameRegistry {
    // Mappings
    mapping(string => address) public nameToAddress;
    mapping(address => string) public addressToName;
    mapping(string => bool) public nameExists;

    // Events
    event NameRegistered(address indexed user, string name);
    event NameUpdated(address indexed user, string oldName, string newName);
    event NameReleased(address indexed user, string name);

    // Errors
    error NameAlreadyTaken();
    error NameTooShort();
    error NameTooLong();
    error InvalidCharacters();
    error NoNameRegistered();

    /**
     * @notice Register or update a name for the caller's address
     * @param name The name to register (3-20 chars, alphanumeric + underscore)
     */
    function registerName(string calldata name) external {
        require(bytes(name).length >= 3, NameTooShort());
        require(bytes(name).length <= 20, NameTooLong());
        require(_isValidName(name), InvalidCharacters());
        require(!nameExists[name], NameAlreadyTaken());

        string memory oldName = addressToName[msg.sender];

        // Release old name if exists
        if (bytes(oldName).length > 0) {
            nameExists[oldName] = false;
            delete nameToAddress[oldName];
        }

        // Register new name
        nameToAddress[name] = msg.sender;
        addressToName[msg.sender] = name;
        nameExists[name] = true;

        if (bytes(oldName).length > 0) {
            emit NameUpdated(msg.sender, oldName, name);
        } else {
            emit NameRegistered(msg.sender, name);
        }
    }

    /**
     * @notice Release the caller's registered name
     */
    function releaseName() external {
        string memory name = addressToName[msg.sender];
        require(bytes(name).length > 0, NoNameRegistered());

        nameExists[name] = false;
        delete nameToAddress[name];
        delete addressToName[msg.sender];

        emit NameReleased(msg.sender, name);
    }

    /**
     * @notice Resolve a name to its associated address
     * @param name The name to resolve
     * @return The address associated with the name (0x0 if not found)
     */
    function resolve(string calldata name) external view returns (address) {
        return nameToAddress[name];
    }

    /**
     * @notice Check if a name is available for registration
     * @param name The name to check
     * @return True if available, false if taken
     */
    function isAvailable(string calldata name) external view returns (bool) {
        return !nameExists[name];
    }

    /**
     * @notice Validate name format (alphanumeric + underscore only)
     * @param name The name to validate
     * @return True if valid, false otherwise
     */
    function _isValidName(string calldata name) internal pure returns (bool) {
        bytes memory b = bytes(name);
        for (uint i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            if (!(char >= 0x30 && char <= 0x39) && // 0-9
                !(char >= 0x41 && char <= 0x5A) && // A-Z
                !(char >= 0x61 && char <= 0x7A) && // a-z
                !(char == 0x5F)) { // _
                return false;
            }
        }
        return true;
    }
}
