// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.18;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {IERC721ReceiverUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IDivitrend} from "./interfaces/IDivitrend.sol";
import {ITrndFactories} from "./interfaces/ITrndFactories.sol";

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title DiviTrendRewards
 * @author ETHERCODE - Exit : https://www.ethercode.dev/ 
 * @dev DiviTrendRewards allows investors to stake $TRND & NFTs to earn rewards
 */

contract DivitrendRewards is Initializable, UUPSUpgradeable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, IERC721ReceiverUpgradeable {
    using SafeERC20 for IERC20;
    uint16 private constant MALUS_DEN = 1000;

    /* Custom Errors */

    error TrndRewards__InvalidAddress();
    error TrndRewards__InvalidAmount();
    error TrndRewards__TransferFailed();
    error TrndRewards__NotEnoughBalance();
    error TrndRewards__NotEnoughAllowance();
    error TrndRewards__InvalidStakingOption();
    error TrndRewards__MaxLimitExceeded(uint256 amount);
    error TrndRewards__ZeroEthRewards();
    error TrndRewards_NotTheNftOwner(uint256 nftId);

    /* Type Declarations */

    struct EthDepositData {
        uint256 amount;
        uint256 timestamp;
        uint256 totStakedThres;
        uint256 remainingAmountNft;
    }

    struct OptionData {
        uint32 vestingTime;
        uint256 apy;
        uint8 maxNftSlots;
        uint256 lastChanged;
    }

    struct TrndStake {
        uint256 amount;
        uint256 timestamp;
        uint256 depositNum;
    }

    struct TrndClaim {
        uint256 totClaimed;
        uint256 lastClaimTime;
        uint256 totCompounded;
        uint256 lastCompTime;
    }

    struct EthClaim {
        uint256 totClaimed;
        uint256 lastClaimTime;
        uint256 depositNum;
    }

    struct NftStake {
        uint256 amount;
        uint256[] nftIds;
        uint256 timestamp;
        uint256 depositNum;
    }

    /* Storage Declarations */

    IDivitrend private divitrend;
    ITrndFactories private factories;
    uint256 private depositNumber;
    uint256 private totalRewardedEth;
    uint256 private threshold; // min tokens to be eligible for rewards
    uint256 private stakingLimit; // max stake per user
    uint256 private totStakingAmount; // total staked tokens
    uint256 private totStakAboveThres; // total staked tokens (Only takes into account user balances above the threshold)
    uint256 private malusPerc; // malus percentage (3 decimals precision)
    uint8 private malusTaxPerc; // malus burn perc
    uint8[] private stakingOptions;

    mapping (uint8 => OptionData) private stakOptionsData; // map option number with staking option data
    mapping (address => TrndStake[]) private totStakingCount; // map user trnd TOTAL stakes data
    mapping(address => mapping (uint8 => TrndStake)) private stakingData; // map user to staking option to trnd stakes data 
    mapping(address => mapping (uint8 => TrndClaim)) private trndClaimData; // map user to staking option to trnd claim data
    mapping (uint256 => EthDepositData) private ethDeposits; // map deposit number to eth deposit data
    mapping(address => EthClaim) private ethClaimData; // map user to eth claim data
    mapping (address => NftStake[]) private totNftCount; // map user Nfts TOTAL stakes data
    mapping(address => mapping (uint8 => NftStake)) private nftStakingData; // map user to staking option to nfts stakes data 

    event EthDeposited(address indexed account, uint256 amount, uint256 remainingsWithdrawn);
    event EthClaimed(address indexed account, uint256 amount); 
    event TrndStaked(address indexed account, uint256 amount, uint8 stakingOption);
    event TrndUnstaked(address indexed account, uint256 amount, uint8 stakingOption);
    event TrndClaimed(address indexed account, uint256 amount, uint8 stakingOption);
    event TrndCompounded(address indexed account, uint256 amount, uint8 stakingOption);
    event FactoriesStaked(address indexed account, uint256 amount, uint256[] nftIds, uint8 stakingOption);
    event FactoriesUnstaked(address indexed account, uint256 amount, uint256[] nftIds, uint8 stakingOption);

    /* Initializer */

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address tokenAddress, address nftAddress) public initializer {

        __Ownable_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        divitrend = IDivitrend(tokenAddress);
        factories = ITrndFactories(nftAddress);
        threshold = 1000 ether; // 1000 $TRND
        stakingLimit = 25000 ether; // 25000 $TRND
        depositNumber = 0;
        malusPerc = 25000; // 25% malus
        malusTaxPerc = 50; // 50% of the malus is burned

        // Define Staking Options
        stakingOptions =[0, 1, 2, 3];
        stakOptionsData[0] = OptionData(7889229, 200, 1, block.timestamp); // 3 months, 2% APY, 1 NFT slot
        stakOptionsData[1] = OptionData(15778458, 400, 2, block.timestamp); // 6 months, 4% APY, 2 NFT slots
        stakOptionsData[2] = OptionData(31556926, 800, 5, block.timestamp); // 1 year, 8% APY, 5 NFT slots
        stakOptionsData[3] = OptionData(63113852, 2000, 10, block.timestamp); // 2 years, 20% APY, 10 NFT slots
    }

    receive() external payable {}

    /* External Functions */

    function enterStaking(uint256 _tokenAmount, uint8 _stakingOption) external payable whenNotPaused nonReentrant {
        // Set up variables
        uint256 optionsLength = stakingOptions.length;
        uint256 stakingLength = totStakingCount[msg.sender].length;
        uint256 stakingAmount = _tokenAmount;
        // Check conditions
        if(_tokenAmount == 0) { revert TrndRewards__InvalidAmount(); }
        if(divitrend.balanceOf(msg.sender) < _tokenAmount) { revert TrndRewards__NotEnoughBalance(); }
        if(_stakingOption >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
                // Need to approve tokens before calling this function
        if(divitrend.allowance(msg.sender, address(this)) < _tokenAmount) { revert TrndRewards__NotEnoughAllowance(); }
        // Keep in the func memory
        TrndStake memory lastStakCount;
        // Check if user has already staked & keep in mind the amount already staked in total
        if(stakingLength > 0) {
            lastStakCount = totStakingCount[msg.sender][stakingLength - 1];
            stakingAmount += lastStakCount.amount;
        }
        // Check if user is eligible for staking
        if(stakingAmount > stakingLimit) { revert TrndRewards__MaxLimitExceeded(stakingLimit); }
        // Send tokens to contract
        divitrend.transferFrom(msg.sender, address(this), _tokenAmount);
        // Keep in mind the amount already staked above the threshold
        totStakingAmount += _tokenAmount;
        if(lastStakCount.amount >= threshold) { totStakAboveThres += _tokenAmount; }
        else if(stakingAmount >= threshold) { totStakAboveThres += stakingAmount; }
        // Add staking data (total count for calculations)
        totStakingCount[msg.sender].push(TrndStake(stakingAmount, block.timestamp, depositNumber));   // Everything refers to the last stake
        // Add staking data (staking option) & keep in mind the amount already staked (for the option)
        uint256 actualAmount = stakingData[msg.sender][_stakingOption].amount;
        actualAmount += _tokenAmount;
        stakingData[msg.sender][_stakingOption] = TrndStake(actualAmount, block.timestamp, depositNumber);
        // Emit event
        emit TrndStaked(msg.sender, _tokenAmount, _stakingOption);
    }
                                                                                                                                                                    // IMPORTANT ! ! ! ! 
    function exitStaking(uint8 _stakingOption) external whenNotPaused nonReentrant {       // please from frontend first claims $TRND rewards (if any) and then exit
        // Set up variables
        uint256 optionsLength = stakingOptions.length;
        uint256 stakingLength = totStakingCount[msg.sender].length;
        uint256 count;
        uint24 malusFee;
        uint256 malus;
        uint256 malusTax;
        uint256 userTokens;
        // Check conditions
        if(_stakingOption >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        // Keep in the func memory
        TrndStake memory stakData = stakingData[msg.sender][_stakingOption];
            // Check if user has balance staked
        if(stakData.amount == 0) { revert TrndRewards__NotEnoughBalance(); }
        TrndStake memory lastStakCount = totStakingCount[msg.sender][stakingLength - 1];
        // Keep in mind amount staked
        userTokens = stakData.amount;
        count = lastStakCount.amount- stakData.amount;
        // Calculate malus (if any)
        malusFee = getActualMalus(msg.sender, _stakingOption);
        if(malusFee != 0){
            malus = (stakData.amount * malusFee) / 100;
            malus = malus / MALUS_DEN; // 3 decimals precision
            userTokens = stakData.amount - malus;
            malusTax = (malus * malusTaxPerc) / 100; // part of the malus is deposited as tax
            divitrend.approve(address(divitrend), malusTax);
            divitrend.depositTax(malusTax);
            // Leave the rest on the staking contract
        }
        // Send tokens from this contract to user
        divitrend.transfer(msg.sender, userTokens);
        // Update data
        totStakingAmount -= stakData.amount;
        if(count >= threshold) { totStakAboveThres -= stakData.amount; }
        else if(lastStakCount.amount >= threshold) { totStakAboveThres -= lastStakCount.amount; }    // subtract the whole amount
        stakingData[msg.sender][_stakingOption] = TrndStake(0, block.timestamp, depositNumber);
        totStakingCount[msg.sender].push(TrndStake(count, block.timestamp, depositNumber));
        // Emit event
        emit TrndUnstaked(msg.sender, stakData.amount, _stakingOption);
    }

    function claimStaking(uint8 _stakingOption, uint8 compoundPerc) external whenNotPaused nonReentrant {
        // Set up variables
        uint256 optionsLength = stakingOptions.length;
        uint256 stakingRewards;
        TrndClaim memory claim = trndClaimData[msg.sender][_stakingOption];
        // Check conditions
        if(compoundPerc > 100) { revert TrndRewards__InvalidAmount(); }
        if(_stakingOption >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        // Calculate rewards
        stakingRewards = pendingStakingRew(msg.sender, _stakingOption);
        // Check if user has rewards
        if(stakingRewards == 0) { revert TrndRewards__NotEnoughBalance(); }
        // Check if contract has enough notStaked balance
        if(divitrend.balanceOf(address(this)) <= totStakingAmount) { revert TrndRewards__NotEnoughBalance(); }
        // Check if user wants to compound
        if(compoundPerc != 0){
            // Keep in the func memory
            uint256 stakingLength = totStakingCount[msg.sender].length;
            TrndStake memory stakData = stakingData[msg.sender][_stakingOption];
            TrndStake memory lastStakCount = totStakingCount[msg.sender][stakingLength - 1];
            uint256 compoundAmount = (stakingRewards * compoundPerc) / 100;
            // Update total rewards
            stakingRewards -= compoundAmount;
            // Stake rewards to user vault
            stakData.amount += compoundAmount;
            // Update totStakAboveThres data
            totStakingAmount += compoundAmount;
            if(lastStakCount.amount >= threshold) { totStakAboveThres += compoundAmount; }
            else if ((lastStakCount.amount + compoundAmount) >= threshold){ 
                totStakAboveThres += (lastStakCount.amount + compoundAmount); 
                } 
            // Update data
            stakingData[msg.sender][_stakingOption] = stakData;
            claim.totCompounded += compoundAmount;
            claim.lastCompTime = block.timestamp;
            // Emit event
            emit TrndCompounded(msg.sender, compoundAmount, _stakingOption);
        }
        if(stakingRewards > 0){
            // Send tokens from this contract to user
            divitrend.transfer(msg.sender, stakingRewards);
            // Update data
            claim.totClaimed += stakingRewards;
            claim.lastClaimTime = block.timestamp;
            // Emit event
            emit TrndClaimed(msg.sender, stakingRewards, _stakingOption);
        }
        // Update data
        trndClaimData[msg.sender][_stakingOption] = claim;
    }

    function stakeNfts(uint256[] memory nftIds, uint8 _stakingOption) external whenNotPaused nonReentrant {     // Set approvalForAll to true before calling this function
        // Set up variables
        uint256 optionsLength = stakingOptions.length;
        uint256 stakingLength = totNftCount[msg.sender].length;
        // Check conditions
        if(_stakingOption >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        // Keep in the func memory
        OptionData memory optionData = stakOptionsData[_stakingOption];
        NftStake storage nftStake = nftStakingData[msg.sender][_stakingOption];
        // Check free NFT slots
        if(optionData.maxNftSlots - nftStake.amount < nftIds.length) { revert TrndRewards__MaxLimitExceeded(optionData.maxNftSlots); }
        // Check if user is the owner of the NFTs
        for(uint i = 0; i < nftIds.length; i++){
            if(factories.ownerOf(nftIds[i]) != msg.sender) { revert  TrndRewards_NotTheNftOwner(nftIds[i]); }
        }
        // Check if NFTs are approved
        if(!factories.isApprovedForAll(msg.sender, address(this))) { revert TrndRewards__NotEnoughAllowance(); }
        // Transfer NFTs to this contract
        for(uint i = 0; i < nftIds.length; i++){
            factories.safeTransferFrom(msg.sender, address(this), nftIds[i]);
            // Add NFTs to the array
            nftStake.nftIds.push(nftIds[i]);
        }
        // Update option nft data
        nftStake.amount += nftIds.length;
        nftStake.timestamp = block.timestamp;
        nftStake.depositNum = depositNumber;
        nftStakingData[msg.sender][_stakingOption] = nftStake;

        // update totNft data
        if(stakingLength == 0){
            totNftCount[msg.sender].push(NftStake(nftIds.length, nftIds, block.timestamp, depositNumber));
        }
        else{
            // Keep in the func memory
            uint[] memory oldNftIds = totNftCount[msg.sender][stakingLength - 1].nftIds;
            uint[] memory newNftIds = new uint[](oldNftIds.length + nftIds.length);
            // Copy old NFTs
            for(uint i = 0; i < oldNftIds.length; i++){
                newNftIds[i] = oldNftIds[i];
            }
            // Add new NFTs
            for(uint i = 0; i < nftIds.length; i++){
                newNftIds[oldNftIds.length + i] = nftIds[i];
            }
            // Push new data
            totNftCount[msg.sender].push(NftStake(newNftIds.length, newNftIds, block.timestamp, depositNumber));
        }
        // Emit event
        emit FactoriesStaked(msg.sender, nftIds.length, nftIds, _stakingOption);
    }

    function unstakeNfts(uint8 _stakingOption, uint256[] memory ids) external whenNotPaused nonReentrant {
        // Set up variables
        uint256 optionsLength = stakingOptions.length;
        uint256[] memory nftIds;
        uint256[] memory newOptNftIds;
        bool found;
        // Check conditions
        if(_stakingOption >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        if(ids.length == 0) { revert TrndRewards__InvalidAmount(); }
        // Keep in the func memory
        NftStake memory nftStake = nftStakingData[msg.sender][_stakingOption];
        // Check if user has NFTs staked
        if(nftStake.amount == 0) { revert TrndRewards__NotEnoughBalance(); }
        // Transfer NFTs to user
        nftIds = nftStake.nftIds;
        for(uint i = 0; i < ids.length; i++){
            found = false;
            for(uint j = 0; j < nftIds.length; j++){
                if(ids[i] == nftIds[j]){
                    found = true;
                    nftIds[j] = nftIds[nftIds.length - (1 + i)];
                    factories.safeTransferFrom(address(this), msg.sender, ids[i]);
                    break;
                }
            }
            if(!found) { revert TrndRewards_NotTheNftOwner(ids[i]); }
        }
        // Create new nft option array
        newOptNftIds = new uint256[](nftIds.length - ids.length);
        if (newOptNftIds.length != 0) {
            for(uint256 i = 0; i < newOptNftIds.length; i++){
                newOptNftIds[i] = nftIds[i];
            }
        }
        // Update totNft data
        uint256 stakingLength = totNftCount[msg.sender].length;
        uint256[] memory oldNftIds = totNftCount[msg.sender][stakingLength - 1].nftIds;
        uint256[] memory newNftIds = new uint256[](oldNftIds.length - ids.length);
        if (newNftIds.length != 0) {
            uint256 newIndex = 0;
            for(uint256 i = 0; i < oldNftIds.length; i++){
                found = false;
                for(uint256 j = 0; j < ids.length; j++){
                    if(oldNftIds[i] == ids[j]){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    newNftIds[newIndex] = oldNftIds[i];
                    newIndex++;
                }
            }
        }
        // Push new data
        totNftCount[msg.sender].push(NftStake(newNftIds.length, newNftIds, block.timestamp, depositNumber));

        // Update option data
        nftStake.amount = newOptNftIds.length;
        nftStake.nftIds = newOptNftIds;
        nftStake.timestamp = block.timestamp;
        nftStake.depositNum = depositNumber;
        nftStakingData[msg.sender][_stakingOption] = nftStake;
        // Emit event
        emit FactoriesUnstaked(msg.sender, ids.length, ids, _stakingOption);
    }

    function claimEth() external whenNotPaused nonReentrant {
        // Set up variables
        EthClaim memory claim = ethClaimData[msg.sender];
        uint256 ethRewards;
        // Calculate rewards
        ethRewards = pendingEthRew(msg.sender);
        ethRewards += pendingNftEthRew(msg.sender);
        // Check if user has rewards
        if(ethRewards == 0) { revert  TrndRewards__ZeroEthRewards(); }
        // Send eth from this contract to user
        (bool success, ) = msg.sender.call{value: ethRewards}("");
        if(!success) { revert TrndRewards__TransferFailed(); }
        // Update data
        claim.totClaimed += ethRewards;
        claim.lastClaimTime = block.timestamp;
        claim.depositNum = depositNumber;
        ethClaimData[msg.sender] = claim;
        // Emit event
        emit EthClaimed(msg.sender, ethRewards);
    }

    /* Owner Functions */

    function depositETH() external payable whenNotPaused onlyOwner {
        if(msg.value == 0 || msg.value < 1000) { revert TrndRewards__InvalidAmount(); }
        uint256[] memory nftIds;
        uint256 nftPartition;
        uint256 remainingAmountNft;
        uint256 totalNftDepositPerc;
        depositNumber++;
        totalRewardedEth += msg.value;
        nftPartition = msg.value / 2;
        remainingAmountNft = nftPartition;
        nftIds = factories.tokensOfOwner(address(this));
        if(nftIds.length != 0){
            ( , totalNftDepositPerc) = factories.getTotalBoosts(nftIds);
            remainingAmountNft = (nftPartition * totalNftDepositPerc) / 10000;
            remainingAmountNft = nftPartition - remainingAmountNft;
            (bool success, ) = msg.sender.call{value: remainingAmountNft}("");
            if(!success) { revert TrndRewards__TransferFailed(); }
        }
        ethDeposits[depositNumber] = EthDepositData(msg.value, block.timestamp, totStakAboveThres, remainingAmountNft);
        // Emit event
        emit EthDeposited(msg.sender, msg.value, remainingAmountNft);
    }

    function setTRNDAddress(address tokenAddress) external onlyOwner {
        if(tokenAddress == address(0)) { revert TrndRewards__InvalidAddress(); }
        divitrend = IDivitrend(tokenAddress);
    }

    function setTrndNftAddress(address nftAddress) external onlyOwner {
        if(nftAddress == address(0)) { revert TrndRewards__InvalidAddress(); }
        factories = ITrndFactories(nftAddress);
    }

    function setThreshold(uint256 amount) external onlyOwner {
        threshold = amount;
    }

    function setStakingOptions(uint8[] memory options) external onlyOwner {
        stakingOptions = options;
    }

    function setStakingOptionData(uint8 option, uint32 vestingTime, uint256 apy, uint8 maxNftSlots) external onlyOwner {
        uint256 optionsLength = stakingOptions.length;
        if(option >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        stakOptionsData[option] = OptionData(vestingTime, apy, maxNftSlots, block.timestamp);
    }

    function setStakingLimit(uint256 amount) external onlyOwner {
        stakingLimit = amount;
    }

    function setMalusPerc(uint24 perc) external onlyOwner {
        malusPerc = perc;
    }

    function setMalusTaxPerc(uint8 perc) external onlyOwner {
        malusTaxPerc = perc;
    }

    function withdrawETH() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        if(!success) { revert TrndRewards__TransferFailed(); }
    }

    function withdrawTokens(address tokenAddress) external onlyOwner {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transfer(msg.sender, balance);
    }

    function withdrawERC721(address nftAddress, uint256 tokenId) external onlyOwner {
        ITrndFactories(nftAddress).transferFrom(address(this), msg.sender, tokenId);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /* Public Functions */

    /* Internal Functions */

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /* Private Functions */

    /* Internal & Private View & Pure Functions */

    /* External & Public View & Pure Functions */

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getContractNftBalance() external view returns (uint256) {
        return factories.balanceOf(address(this));
    }

    function getTRNDAddress() external view returns (address) {
        return address(divitrend);
    }

    function getTrndNftAddress() external view returns (address) {
        return address(factories);
    }

    function getTotalRewardedETH() external view returns (uint256) {
        return totalRewardedEth;
    }

    function getThreshold() external view returns (uint256) {
        return threshold;
    }

    function getDepositNumber() external view returns (uint256) {
        return depositNumber;
    }

    function getDepositETH(uint256 index) external view returns (uint256, uint256) {
        return (ethDeposits[index].amount, ethDeposits[index].timestamp);
    }

    function getStakingOptions() external view returns (uint8[] memory) {
        return stakingOptions;
    }

    function getStakingOptionData(uint8 option) external view returns (uint32, uint256, uint8, uint256) {
        uint256 optionsLength = stakingOptions.length;
        if(option >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        OptionData memory data = stakOptionsData[option]; 
        return (data.vestingTime, data.apy, data.maxNftSlots, data.lastChanged);
    }

    function getStakingCountHistory(address account) external view returns (TrndStake[] memory) {
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        return totStakingCount[account];
    }

    function getLastStakingCount(address account) external view returns (uint256, uint256, uint256) {
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        uint256 length = totStakingCount[account].length;
        if(length == 0) { return (0, 0, 0); }
        TrndStake memory data = totStakingCount[account][length - 1];
        return (data.amount, data.timestamp, data.depositNum);
    }

    function getUserStakingData(address account, uint8 _stakingOption) external view returns (uint256, uint256, uint256) {
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        uint256 optionsLength = stakingOptions.length;
        if(_stakingOption >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        TrndStake memory data = stakingData[account][_stakingOption];
        return (data.amount, data.timestamp, data.depositNum);
    }

    function getUserStakingClaimData(address account, uint8 _stakingOption) external view returns (uint256, uint256, uint256, uint256) {
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        uint256 optionsLength = stakingOptions.length;
        if(_stakingOption >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        TrndClaim memory data = trndClaimData[account][_stakingOption];
        return (data.totClaimed, data.lastClaimTime, data.totCompounded, data.lastCompTime);
    }

    function getEthDeposit(uint256 index) external view returns (uint256, uint256, uint256, uint256) {
        return (ethDeposits[index].amount, ethDeposits[index].timestamp, ethDeposits[index].totStakedThres, ethDeposits[index].remainingAmountNft);
    }

    function getLastEthDeposit() external view returns (uint256, uint256, uint256, uint256) {
        return (ethDeposits[depositNumber].amount, ethDeposits[depositNumber].timestamp, ethDeposits[depositNumber].totStakedThres, ethDeposits[depositNumber].remainingAmountNft);
    }

    function getUserEthClaimData(address account) external view returns (uint256, uint256, uint256) {
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        EthClaim memory data = ethClaimData[account];
        return (data.totClaimed, data.lastClaimTime, data.depositNum);
    }

    function getUserNftStakingData(address account, uint8 _stakingOption) external view returns (uint256, uint256[] memory, uint256, uint256) {
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        uint256 optionsLength = stakingOptions.length;
        if(_stakingOption >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        NftStake memory data = nftStakingData[account][_stakingOption];
        return (data.amount, data.nftIds, data.timestamp, data.depositNum);
    }

    function getNftCountHistory(address account) external view returns (NftStake[] memory) {
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        return totNftCount[account];
    }

    function getLastNftCount(address account) external view returns (uint256, uint256[] memory, uint256, uint256) {
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        uint256 length = totNftCount[account].length;
        if(length == 0) { return (0, new uint256[](0), 0, 0); }
        NftStake memory data = totNftCount[account][length - 1];
        return (data.amount, data.nftIds, data.timestamp, data.depositNum);
    }

    function getTotStakingAmount() external view returns (uint256) {
        return totStakingAmount;
    }

    function getTotStakAboveThres() external view returns (uint256) {
        return totStakAboveThres;
    }

    function getStakingLimit() external view returns (uint256) {
        return stakingLimit;
    }

    function getMalusPerc() external view returns (uint256) {
        return malusPerc / MALUS_DEN;
    }

    function getMalusTaxPerc() external view returns (uint8) {
        return malusTaxPerc;
    }

    function getPaused() external view returns (bool) {
        return paused();
    }

    function getActualMalus(address account, uint8 _stakingOption) public view returns (uint24) {
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        uint256 optionsLength = stakingOptions.length;
        if(_stakingOption >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        uint256 actualMalus;
        uint256 passedMalus;
        uint256 stakingLength = totStakingCount[account].length;
        if(stakingLength == 0) { return 0; }
        TrndStake memory lastStake = stakingData[account][_stakingOption];
        OptionData memory optionData = stakOptionsData[_stakingOption];
        // No malus if vesting time is passed
        if(block.timestamp - lastStake.timestamp >= optionData.vestingTime) { return 0; }
        passedMalus = (malusPerc * 1e6) / optionData.vestingTime;
        passedMalus = (passedMalus * (block.timestamp - lastStake.timestamp)) / 1e6;
        actualMalus = malusPerc - passedMalus;
        return uint24(actualMalus);
    }

    function pendingStakingRew(address account, uint8 _stakingOption) public view returns (uint256) {
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        uint256 optionsLength = stakingOptions.length;
        uint256 timePassed;
        uint256 totApy;
        if(_stakingOption >= optionsLength) { revert TrndRewards__InvalidStakingOption(); }
        // Keep in the func memory
        TrndStake memory lastStake = stakingData[account][_stakingOption];
        TrndClaim memory lastClaim = trndClaimData[account][_stakingOption];
        OptionData memory optionData = stakOptionsData[_stakingOption];
        NftStake memory nftStake = nftStakingData[account][_stakingOption];
        // Check if user has balance staked
        if(lastStake.amount == 0) { return 0;}
        // Check if is first claim
        if(lastClaim.lastClaimTime == 0) {timePassed = block.timestamp - lastStake.timestamp;}
        else {timePassed = block.timestamp - lastClaim.lastClaimTime;}
        // Calculate tot apy with nft boost (if any)
        totApy = optionData.apy;
        if(nftStake.amount > 0) { 
            (uint256 boostApy, ) = factories.getTotalBoosts(nftStake.nftIds);
            totApy += boostApy;
        }
        // Calculate rewards
        uint256 stakingRewards = (lastStake.amount * totApy) / 10000;     // 2 Decimals & / 100
        stakingRewards = (stakingRewards * timePassed) / 31556926; // 1 year in seconds
        return stakingRewards;
    }

    function pendingEthRew(address account) public view returns (uint256){
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        uint256 stakingLength = totStakingCount[account].length;
        if(stakingLength == 0) { return 0; }
        if(depositNumber == 0) { return 0; }
        // Keep in the func memory
        EthClaim memory lastClaim = ethClaimData[account];
        // Set new vars
        EthDepositData memory deposit;
        TrndStake memory lastStakCount;        
        TrndStake memory stakCount;
        uint256 startDeposit;
        uint256 depositAmount;  
        uint256 userStakPerc;
        uint256 userStakRew = 0;
        bool found;
        // If user has never claimed
        if(lastClaim.lastClaimTime == 0){
            lastStakCount = totStakingCount[account][0];
            startDeposit = lastStakCount.depositNum;
        } else {    // If user has already claimed
            startDeposit = lastClaim.depositNum;
        }
        // No rewards if there aren't new deposits to claim
        if(startDeposit == depositNumber) {return 0; }
        // Check all deposits from the last claimed to the last one
        for(uint i = startDeposit; i < depositNumber; i++){
            found = false;
            deposit = ethDeposits[i+1]; // +1 because we start from the last claimed
            depositAmount = deposit.amount / 2; // 50% of the deposit is for $TRND stakers
             // Calculate user staking amount at the moment of the deposit
            for(uint c=0; c<stakingLength; c++){
                stakCount = totStakingCount[account][c];
                if(stakCount.depositNum == i +1){
                    lastStakCount = totStakingCount[account][c-1];
                    found = true;
                    break;
                }
            }
            // If user has never staked/unstaked after the deposit
            if(!found){ lastStakCount = totStakingCount[account][stakingLength - 1]; }
            // Check if user has staked above the threshold
            if(lastStakCount.amount >= threshold && deposit.totStakedThres != 0) {
                userStakPerc = lastStakCount.amount * 1e6 / deposit.totStakedThres; // % of totStakeAboveThres (at the time of deposit)
                userStakRew += (depositAmount * userStakPerc) / 1e6; // amount of user's rewards
                // 1e6 because a little number / a bigger number = 0
            }
        }
        return userStakRew;
    }

    function pendingNftEthRew(address account) public view returns (uint256){
        if(account == address(0)) { revert TrndRewards__InvalidAddress(); }
        uint256 stakingLength =  totNftCount[account].length;
        if(stakingLength == 0) { return 0; }
        if(depositNumber == 0) { return 0; }
        // Keep in the func memory
        EthClaim memory lastClaim = ethClaimData[account];
        // Set new vars
        EthDepositData memory deposit;
        NftStake memory lastNftCount;
        NftStake memory nftCount;
        uint256 startDeposit;
        uint256 depositAmount;  
        uint256 userStakPerc;
        uint256 userStakRew = 0;
        bool found;
        // If user has never claimed
        if(lastClaim.lastClaimTime == 0){
            lastNftCount = totNftCount[account][0];
            startDeposit = lastNftCount.depositNum;
        } else {    // If user has already claimed
            startDeposit = lastClaim.depositNum;
        }
        // No rewards if there aren't new deposits to claim
        if(startDeposit == depositNumber) {return 0; }
        // Check all deposits from the last claimed to the last one
        for(uint i = startDeposit; i < depositNumber; i++){
            found = false;
            deposit = ethDeposits[i+1]; // +1 because we start from the last claimed
            depositAmount = deposit.amount / 2; // 50% of the deposit is for NFT stakers
             // Calculate user staking amount at the moment of the deposit
            for(uint c=0; c<stakingLength; c++){
                nftCount = totNftCount[account][c];
                if(nftCount.depositNum == i +1){
                    lastNftCount = totNftCount[account][c-1];
                    found = true;
                    break;
                }
            }
            // If user has never staked/unstaked after the deposit
            if(!found){ lastNftCount = totNftCount[account][stakingLength - 1]; }
            // Check if user has staked nft are > 0
            if(lastNftCount.amount > 0) {
                ( , userStakPerc) = factories.getTotalBoosts(lastNftCount.nftIds);  // % of deposit amount for NFTs
                userStakRew += (depositAmount * userStakPerc) / 10000;  // amount of user's rewards
                //10000 because % is 2 decimals so 100 for % and 100 for decimals
            }
        }
        return userStakRew;
    }
}