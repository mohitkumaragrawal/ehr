// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DataContract.sol";
import "./RegistryContract.sol";

contract PermissionContract {
    
    struct PermissionRequest {
        address requester;
        address approver;
        string fileHash;
        bool exists;
    }

    mapping(address => PermissionRequest[]) public pendingRequests;

    DataContract public dataContract;
    RegistryContract public registryContract;

    event PermissionRequested(address indexed requester, address indexed approver, string fileHash);
    event PermissionGranted(address indexed requester, address indexed approver, string fileHash, string encryptedSymmetricKey);
    event PermissionRejected(address indexed requester, address indexed approver, string fileHash);

    constructor(address dataContractAddress, address registryContractAddress) {
        dataContract = DataContract(dataContractAddress);
        registryContract = RegistryContract(registryContractAddress);
    }

    modifier requestExists(address approver, uint index) {
        require(pendingRequests[approver][index].exists, "Permission request does not exist.");
        _;
    }

    function requestPermission(address approver, string memory fileHash) external {
        PermissionRequest memory newRequest = PermissionRequest({
            requester: msg.sender,
            approver: approver,
            fileHash: fileHash,
            exists: true
        });

        pendingRequests[approver].push(newRequest);
        emit PermissionRequested(msg.sender, approver, fileHash);
    }

    function getPendingRequests() external view returns (PermissionRequest[] memory) {
        return pendingRequests[msg.sender];
    }

    function grantPermission(uint index, string memory encryptedSymmetricKeyWithRequester) 
        external 
        requestExists(msg.sender, index) 
    {
        PermissionRequest memory request = pendingRequests[msg.sender][index];

        (
            bool isRegistered,
            ,
            string memory publicKey
        ) = registryContract.checkUser(msg.sender);
        
        require(isRegistered, "Approver not registered.");
        require(dataContract.metadataExists(request.fileHash, publicKey), "File metadata does not exist for approver.");

        DataContract.Metadata memory metadata = dataContract.searchData(request.fileHash, publicKey);

        dataContract.addPermissionGrantedMetadata(
            request.requester,
            request.fileHash,
            metadata.dataType,
            metadata.storedDataCID,
            encryptedSymmetricKeyWithRequester,
            metadata.fileName
        );
        _removeRequest(msg.sender, index);
        emit PermissionGranted(request.requester, msg.sender, request.fileHash, encryptedSymmetricKeyWithRequester);
    }

    function rejectPermission(uint index) 
        external 
        requestExists(msg.sender, index) 
    {
        PermissionRequest memory request = pendingRequests[msg.sender][index];
        emit PermissionRejected(request.requester, msg.sender, request.fileHash);
        _removeRequest(msg.sender, index);
    }

    function _removeRequest(address approver, uint index) internal {
        uint lastIndex = pendingRequests[approver].length - 1;

        pendingRequests[approver][index] = pendingRequests[approver][lastIndex];
        pendingRequests[approver].pop();
    }
}
