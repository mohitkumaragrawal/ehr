// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RegistryContract {
    enum Role { User, CareProvider, Miner, Researcher }

    struct Entity {
        string publicKey;
        Role role;
        bool isRegistered;
    }

    mapping(address => Entity) public entities;

    event EntityRegistered(address indexed publicKey, Role role);

    modifier notRegistered() {
        require(!entities[msg.sender].isRegistered, "Already registered.");
        _;
    }

    function registerUser(Role role, string memory publicKey) external notRegistered {
        entities[msg.sender] = Entity(publicKey, role, true);
        emit EntityRegistered(msg.sender, role);
    }

    function checkUser(address publicKey) external view returns (bool, Role, string memory) {
        Entity memory entity = entities[publicKey];
        require(entity.isRegistered, "Not registered.");
        return (entity.isRegistered, entity.role, entity.publicKey);
    }
}
