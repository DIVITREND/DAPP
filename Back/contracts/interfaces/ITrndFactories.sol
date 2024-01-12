// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ITrndFactories is IERC721 {
    function initialize() external;

    function payNfts(uint16 _amount) external payable;

    function claimNfts() external;

    function ownerOf(uint256 tokenId) external view returns (address);

    function isApprovedForAll(
        address owner,
        address operator
    ) external view returns (bool);

    function setCost(uint256 _newCost) external;

    function setMaxCost(uint256 _newMaxCost) external;

    function setCashWallet(address _new) external;

    function setmaxMintAmount(uint16 _newmaxMintAmount) external;

    function setBaseExtension(string memory _newBaseExtension) external;

    function setTimeStart(uint256 _newTimeStart) external;

    function setNftBoostData(
        uint8 _nftType,
        uint16 _newApyBoost,
        uint16 _newDepositPerc
    ) external;

    function setNftTypesArray(uint8[299] memory _newNftTypesArray) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

    function withdraw() external payable;

    function recoverToken(address _token) external;

    function recoverNonFungibleToken(address _token, uint256 _tokenId) external;

    function setBaseURI(string memory _newBaseURI) external;

    function getCost() external view returns (uint256);

    function getActualSupply() external view returns (uint16);

    function getMaxMintAmount() external view returns (uint16);

    function getMaxCost() external view returns (uint256);

    function getCashWallet() external view returns (address);

    function getTimeStart() external view returns (uint256);

    function getTotalIdsArray() external view returns (uint16[] memory);

    function getIdsArrayLength() external view returns (uint256);

    function getIdsArray(uint16 _index) external view returns (uint16);

    function getUserTokensLength(address _user) external view returns (uint256);

    function getNftBoostData(
        uint8 _nftType
    ) external view returns (uint16, uint16);

    function getNftTypesArray(uint256 _index) external view returns (uint8);

    function getTotalBoosts(uint256[] memory _ids) external view returns (uint256, uint256);

    function tokensOfOwner(
        address _owner
    ) external view returns (uint256[] memory);

    function totalSupply() external view returns (uint16);

    function calCost(uint256 _num) external view returns (uint256);
}
