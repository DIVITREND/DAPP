// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.18;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title DiviTrend Factories NFTs
 * @author ETHERCODE - Exit : https://www.ethercode.dev/ 
 */

contract DivitrendFactories is Initializable, UUPSUpgradeable, OwnableUpgradeable, ERC721Upgradeable, ReentrancyGuardUpgradeable {
    
    error Fact__NftsSoldOut();
    error Fact__InvalidAmount();
    error Fact__TransferFailed();
    error Fact__ZeroBalance();
    error Fact__MintNotLive();
    error Fact__NotEnoughFunds();
    error Fact__MintAtOnceExceeded();
    error Fact__MaxMintExceeded(uint256 maxMintAmount);
    error Fact__MaxCostReached(uint256 maxCost);
    error Fact__NoTokensAvailable();
    error Fact__ContractsCannotMint();

    /* Structs */

    struct NftBoost {
        uint16 apyBoost;
        uint16 depositPerc;
    }

    /* State Variables */

    using Strings for uint256;
    string public baseURI;
    string public baseExtension = ".json";
    uint256 private cost;
    uint16 private actualSupply;
    uint16 private maxSupply;
    uint16 private maxMintAmount;
    uint256 private maxCost;
    address private cashWallet;
    uint256 private timeStart;
    uint256 private nonce;
    uint16[] private idsArray;
    // CHANGE !!!                                                                       KEEP ATTENCTION ! ! !
    uint8[299] private nftTypesArray;

    // Store tokenIds for each user (Mint)
    mapping (address => uint16[]) private userTokens;
    // Store NFTs Boosts
    mapping (uint8 => NftBoost) private nftBoostData;

    event NftPayed(address indexed account, uint256 amount);
    event NftMinted(address indexed account, uint16[] tokenIds);

    /* Constructor */

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize() public initializer{
        __Ownable_init();
        __ReentrancyGuard_init();
        __ERC721_init("Divitrend Factories", "FACT");
        __UUPSUpgradeable_init();
        setBaseURI("https://ipfs.io/ipfs/QmSy1LTA8ffSLV6P5JBQ6gPD8hrp2mHzFpApcCFBJ7YVrj/");      // CHANGE !!!
        nonce = 100000;
        actualSupply = 0;
        maxSupply = 299;
        cost = 100;//50000000000000000;   // wei price
        maxCost = 150000000000000000; // max wei price
        maxMintAmount = 10; // MAX Mint at once
        cashWallet = 0x3d83988bED2E59dE9d65c0bB0CA42AB133527A74;                                                    // CHANGE !!!
        timeStart = 100; // 5 Oct 2023 19:00:00 GMT

        // Populate the idsArray with all the tokenIds                                                  
        for(uint16 i = 1; i <= maxSupply; i++) {
            idsArray.push(i);
        }

        // Define NFTs Boosts
        nftBoostData[1] = NftBoost(25,10); // Small Factory Standard
        nftBoostData[2] = NftBoost(50,20); // Small Factory Special 
        nftBoostData[3] = NftBoost(75,30); // Small Factory Elite'
        nftBoostData[4] = NftBoost(100,40); // Medium Factory Standard
        nftBoostData[5] = NftBoost(125,50); // Medium Factory Special
        nftBoostData[6] = NftBoost(150,75); // Medium Factory Elite'
        nftBoostData[7] = NftBoost(200,100); // Large Factory Standard
        nftBoostData[8] = NftBoost(250,200); // Large Factory Special
        nftBoostData[9] = NftBoost(500,300); // Large Factory Elite'
    }

    /* External Functions */

    function payNfts(uint16 _amount) external payable nonReentrant {
        // Checks
        if(timeStart > block.timestamp) revert Fact__MintNotLive();
        if (msg.sender != tx.origin) revert Fact__ContractsCannotMint();
        uint16 supply = actualSupply;
        if(_amount == 0) revert Fact__InvalidAmount();
        if(_amount > maxMintAmount) revert Fact__MintAtOnceExceeded();
        if(supply + _amount > maxSupply) revert Fact__NftsSoldOut();
        if(msg.value < calCost(_amount)) revert Fact__NotEnoughFunds();
        // Transfer founds
        (bool os, ) = payable(cashWallet).call{value: msg.value}("");
        if(!os) revert Fact__TransferFailed();
        // Update variables
        actualSupply += _amount;
        uint16 index;
        // Extract and remove indexes from idsArray
        for(uint i = 0; i < _amount; i++) {
            // Extract index
            index = extractIndex();
            // Save the tokenId in user memory
            userTokens[msg.sender].push(idsArray[index]);
            // Remove the tokenId from idsArray
            remove(index);
            // Update nonce
            nonce+=4;
        }
        // Emit event
        emit NftPayed(msg.sender, _amount);
    }

    function claimNfts() external nonReentrant {
        // Checks
        if(timeStart > block.timestamp) revert Fact__MintNotLive();
        if (msg.sender != tx.origin) revert Fact__ContractsCannotMint();
        uint256 length = userTokens[msg.sender].length;
        if(length == 0) revert Fact__NoTokensAvailable();
        // Keep in memory
        uint16[] memory tokensArray = userTokens[msg.sender];
        // Mint NFTs
        for(uint i = 0; i < length; i++) {
            // Mint
            mint(tokensArray[i]);
            // Update nonce
            nonce-=3;
        }
        // Delete userTokens[msg.sender]
        delete userTokens[msg.sender];
        // Emit event
        emit NftMinted(msg.sender, tokensArray);
    }

    /* Setter Functions */ 

    function adminMint(uint16 _amount, address _recipient) external onlyOwner{
        // Checks
        if (msg.sender != tx.origin) revert Fact__ContractsCannotMint();
        uint16 supply = actualSupply;
        if(_amount == 0) revert Fact__InvalidAmount();
        if(supply + _amount > maxSupply) revert Fact__NftsSoldOut();
        // Update variables
        actualSupply += _amount;
        uint16 index;
        // Extract and remove indexes from idsArray
        for(uint i = 0; i < _amount; i++) {
            // Extract index
            index = extractIndex();
            // Mint the tokenId to the recipient
            _safeMint(_recipient, idsArray[index]);
            // Remove the tokenId from idsArray
            remove(index);
            // Update nonce
            nonce+=2;
        }
        // Emit event
        emit NftMinted(_recipient, idsArray);
    }

    function setCost(uint256 _newCost) external onlyOwner {
        if(cost >= maxCost) revert Fact__MaxCostReached(maxCost);
        cost = _newCost;
    }

    function setMaxCost(uint256 _newMaxCost) external onlyOwner {
        maxCost = _newMaxCost;
    }
    
    function setCashWallet(address _new) external onlyOwner{
        cashWallet = _new;
    }

    function setmaxMintAmount(uint16 _newmaxMintAmount) external onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    function setBaseExtension(string memory _newBaseExtension) external onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function setTimeStart(uint256 _newTimeStart) external onlyOwner {
        timeStart = _newTimeStart;
    }

    function setNftBoostData(uint8 _nftType, uint16 _newApyBoost, uint16 _newDepositPerc) external onlyOwner {
        nftBoostData[_nftType] = NftBoost(_newApyBoost, _newDepositPerc);
    }

    function setNftTypesArray(uint8[299] memory _newNftTypesArray) external onlyOwner {
        nftTypesArray = _newNftTypesArray;
    }

    /* Withdraw Functions */
    
    function withdraw() external payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        if(!os) revert Fact__TransferFailed();
    }

    function recoverToken(address _token) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        if(balance == 0) revert Fact__ZeroBalance();
        IERC20(_token).transfer(address(msg.sender), balance);
    }

    function recoverNonFungibleToken(address _token, uint256 _tokenId) external onlyOwner {
    IERC721(_token).transferFrom(address(this), address(msg.sender), _tokenId);
    }

    /* Public Functions */

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    /* Private Functions */
    
    function mint(uint256 _tokenId) private {                            
            // Safe mint
            _safeMint(msg.sender, _tokenId);
    }

    function remove(uint index) private {
        if(index >= idsArray.length) revert Fact__InvalidAmount();
        // Move the last element into the place of index
        idsArray[index] = idsArray[idsArray.length - 1];
        // Remove the last element
        idsArray.pop();
    }

    /* Private View Functions */

    function getSeed() private view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.coinbase, block.timestamp, block.number, msg.sender.balance, gasleft())));
        seed = uint256(keccak256(abi.encodePacked(seed - nonce)));
        return seed;
    } 

    function extractIndex() private view returns(uint16){
        uint256 seed = getSeed();
        uint256 random;
        // from 0 to idsArray.length - 1
        random = seed % idsArray.length;

        return (uint16( random));
    }

    /* Internal & Public View Functions */

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
        _exists(tokenId),
        "ERC721Metadata: URI query for nonexistent token"
        );
    
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
            : "";
    }

    /* Getter Functions */

    function getCost() external view returns(uint256){
        return cost;
    }

    function getActualSupply() external view returns(uint16){
        return actualSupply;
    }

    function getMaxMintAmount() external view returns(uint16){
        return maxMintAmount;
    }

    function getMaxCost() external view returns(uint256){
        return maxCost;
    }

    function getCashWallet() external view returns(address){
        return cashWallet;
    }

    function getTimeStart() external view returns(uint256){
        return timeStart;
    }

    function getTotalIdsArray() external view returns(uint16[] memory){
        return idsArray;
    }

    function getIdsArrayLength() external view returns(uint256){
        return idsArray.length;
    }

    function getIdsArray(uint16 _index) external view returns(uint16){
        return idsArray[_index];
    }

    function getUserTokensLength(address _user) external view returns(uint256){
        return userTokens[_user].length;
    }

    function getNftBoostData(uint8 _nftType) external view returns(uint16, uint16){
        return (nftBoostData[_nftType].apyBoost, nftBoostData[_nftType].depositPerc);
    }

    function getNftTypesArray(uint256 _index) external view returns(uint8){
        return nftTypesArray[_index];
    }

    function getTotalBoosts(uint16[] memory _ids) external view returns(uint256, uint256){
        uint256 totalApyBoost;
        uint256 totalDepositPerc;
        for(uint i = 0; i < _ids.length; i++) {
            uint16 id = _ids[i] - 1;
            totalApyBoost += nftBoostData[nftTypesArray[id]].apyBoost;
            totalDepositPerc += nftBoostData[nftTypesArray[id]].depositPerc;
        }
        return (totalApyBoost, totalDepositPerc);
    }

    function tokensOfOwner(address _owner) external view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalTokens = totalSupply();
            uint256 resultIndex = 0;
            // Iterate over total token supply
            for (uint256 tokenId = 0; tokenId < totalTokens; tokenId++) {
                try this.ownerOf(tokenId) returns (address owner) {
                    if (owner == _owner) {
                        result[resultIndex] = tokenId;
                        resultIndex++;
                    }
                } catch {
                    // Ignore the error
                } 
            }
            return result;
        }
    }

    function totalSupply() public view returns(uint16){
        return maxSupply;
    }
    
    function calCost(uint256 _num) public view returns(uint256){
        return _num * cost;
    }
}