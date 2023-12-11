/**
                                                    

__/\\\\\\\\\\\\_____/\\\\\\\\\\\__/\\\________/\\\__/\\\\\\\\\\\__/\\\\\\\\\\\\\\\____/\\\\\\\\\______/\\\\\\\\\\\\\\\__/\\\\\_____/\\\__/\\\\\\\\\\\\____        
 _\/\\\////////\\\__\/////\\\///__\/\\\_______\/\\\_\/////\\\///__\///////\\\/////___/\\\///////\\\___\/\\\///////////__\/\\\\\\___\/\\\_\/\\\////////\\\__       
  _\/\\\______\//\\\_____\/\\\_____\//\\\______/\\\______\/\\\___________\/\\\_______\/\\\_____\/\\\___\/\\\_____________\/\\\/\\\__\/\\\_\/\\\______\//\\\_      
   _\/\\\_______\/\\\_____\/\\\______\//\\\____/\\\_______\/\\\___________\/\\\_______\/\\\\\\\\\\\/____\/\\\\\\\\\\\_____\/\\\//\\\_\/\\\_\/\\\_______\/\\\_     
    _\/\\\_______\/\\\_____\/\\\_______\//\\\__/\\\________\/\\\___________\/\\\_______\/\\\//////\\\____\/\\\///////______\/\\\\//\\\\/\\\_\/\\\_______\/\\\_    
     _\/\\\_______\/\\\_____\/\\\________\//\\\/\\\_________\/\\\___________\/\\\_______\/\\\____\//\\\___\/\\\_____________\/\\\_\//\\\/\\\_\/\\\_______\/\\\_   
      _\/\\\_______/\\\______\/\\\_________\//\\\\\__________\/\\\___________\/\\\_______\/\\\_____\//\\\__\/\\\_____________\/\\\__\//\\\\\\_\/\\\_______/\\\__  
       _\/\\\\\\\\\\\\/____/\\\\\\\\\\\______\//\\\________/\\\\\\\\\\\_______\/\\\_______\/\\\______\//\\\_\/\\\\\\\\\\\\\\\_\/\\\___\//\\\\\_\/\\\\\\\\\\\\/___ 
        _\////////////_____\///////////________\///________\///////////________\///________\///________\///__\///////////////__\///_____\/////__\////////////_____

    DiviTrend (TM) 
    Website: https://www.divitrend.finance/
    Telegram: https://t.me/DiviTrend
    Twitter: https://twitter.com/DiviTrend

 */

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

/**
 * @title DiviTrend Token
 * @author ETHERCODE - Exit : https://www.ethercode.dev/ 
 */

contract Divitrend is ERC20, Ownable, ERC20Pausable, ERC20Burnable, ERC20Snapshot {

    error Trnd__BlacklistedAddress(address addr);
    error Trnd__AlreadyBlacklisted(address addr);
    error Trnd__NotBlacklisted(address addr);
    error Trnd__AlreadyExcluded(address addr);
    error Trnd__NotExcluded(address addr);
    error Trnd__TaxExceedsLimit(uint256 tax);
    error Trnd__ZeroAddress();
    error Trnd__ContractPaused();
    error Trnd__ContractNotPaused();
    error Trnd__TransferFailed(address addr);
    error Trnd__ZeroCollectedTaxes();
    error Trnd__InvalidAmount();

    uint16 private constant DENOMINATOR = 1000;

    uint256 private collectedTaxes;
    uint256 private swapThreshold; 
    bool private autoSwap;

    uint8 private buyTax;
    uint8 private sellTax;

    uint16 private stakedCapPerc;
    uint16 private founderPerc;
    uint16 private liquidityPerc;

    address private stakedCapitalWallet;
    address private founderWallet;
    address private liquidityWallet;

    IUniswapV2Pair private uniswapV2Pair;
    IUniswapV2Factory private uniswapV2Factory;
    IUniswapV2Router02 private uniswapV2Router02;
    address private _divRewardsAddress;
    address private _referralAddress;
    address private _exchangeAddress;

    mapping (address => bool) private blacklist;
    mapping (address => bool) private excludeList;

    event TaxHandled(uint256 amount, uint256 tax);
    event TaxDeposited(address indexed account, uint256 amount);
    event Swapped(address indexed account, uint256 amount, bool isBuy, uint256 reserve0, uint256 reserve1);

    constructor() ERC20("DiviTrend", "TRND") {
        swapThreshold = 5000 ether;
        autoSwap = true;
        buyTax = 15;
        sellTax = 15;
        stakedCapPerc = 800;
        founderPerc = 133;
        liquidityPerc = 67;
        excludeList[address(this)] = true;
        excludeList[msg.sender] = true;
        _mint(msg.sender, 1000000 ether);
    }

    receive() external payable {}

    function depositTax(uint256 taxAmount) external payable {
        if(taxAmount == 0) revert Trnd__InvalidAmount();
        // transfer tax to contract and add to collected taxes
        _transfer(msg.sender, address(this), taxAmount);
        collectedTaxes += taxAmount;
    }

    /* Setter Functions */ 

    function createSnapshot() external onlyOwner{
        _snapshot();
    }

    function pause() external onlyOwner {
        if(paused()) revert Trnd__ContractPaused();
        _pause();
    }

    function unpause() external onlyOwner {
        if(!paused()) revert Trnd__ContractNotPaused();
        _unpause();
    }

    function enableBlacklist(address account) external onlyOwner {
        if(blacklist[account]) revert Trnd__AlreadyBlacklisted(account);
        blacklist[account] = true;
    }

    function disableBlacklist(address account) external onlyOwner {
        if(!blacklist[account]) revert Trnd__NotBlacklisted(account);
        blacklist[account] = false;
    }

    function setBuyTax(uint8 tax) external onlyOwner {
        if(tax > 15) revert Trnd__TaxExceedsLimit(tax);
        buyTax= tax;
    }

     function setSellTax(uint8 tax) external onlyOwner {
        if(tax > 15) revert Trnd__TaxExceedsLimit(tax);
        sellTax = tax;
    }

    function setDivitrendRewardsAddress(address account) external onlyOwner {
        if(account == address(0)) revert Trnd__ZeroAddress();
        _divRewardsAddress = account;
        if(!isExcluded(account)) exclude(_divRewardsAddress);
    }

    function setExchangeAddress(address account) external onlyOwner {
        if(account == address(0)) revert Trnd__ZeroAddress();
        _exchangeAddress = account;
    }

    function setFounderWallet(address account) external onlyOwner {
       if(account == address(0)) revert Trnd__ZeroAddress();
        founderWallet = account;
        if(!isExcluded(account)) exclude(founderWallet);
    }

    function setLiquidityWallet(address account) external onlyOwner payable{
        if(account == address(0)) revert Trnd__ZeroAddress();
        liquidityWallet = account;
        if(!isExcluded(account)) exclude(liquidityWallet);
    }

    function setStakedCapitalWallet(address account) external onlyOwner {
        if(account == address(0)) revert Trnd__ZeroAddress();
        stakedCapitalWallet = account;
        if(!isExcluded(account)) exclude(stakedCapitalWallet);
    }

    function setStakedCapPerc(uint16 perc) external onlyOwner {
        stakedCapPerc = perc;
    }

    function setFounderPerc(uint16 perc) external onlyOwner {
        founderPerc = perc;
    }

    function setLiquidityPerc(uint16 perc) external onlyOwner {
        liquidityPerc = perc;
    }

    function setSwapThreshold(uint256 amount) external onlyOwner {
        swapThreshold = amount;
    }

    function setAutoSwap(bool value) external onlyOwner {
        autoSwap = value;
    }

    function setRouterAddress(address account) external onlyOwner{
        if(account == address(0)) revert Trnd__ZeroAddress();

        uniswapV2Router02 = IUniswapV2Router02(account);
        uniswapV2Factory = IUniswapV2Factory(uniswapV2Router02.factory());

        address pairAddress = IUniswapV2Factory(uniswapV2Router02.factory()).getPair(address(this), uniswapV2Router02.WETH());
        if(pairAddress == address(0)) pairAddress = uniswapV2Factory.createPair(address(this), uniswapV2Router02.WETH());
        uniswapV2Pair = IUniswapV2Pair(pairAddress);
    }

    function manualSwapAndLiquify() external onlyOwner {
            _approve(address(this), address(uniswapV2Router02), collectedTaxes);
            swapAndLiquify(); 
            collectedTaxes = 0;
    }  

    function withdrawETH() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        if(!success) revert Trnd__TransferFailed(msg.sender);
    }

    function withdrawTokens(address tokenAddress) external onlyOwner {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transfer(msg.sender, balance);
    }

    function exclude(address account) public onlyOwner {
        if(isExcluded(account)) revert Trnd__AlreadyExcluded(account);
        excludeList[account] = true;
    }

    function removeExclude(address account) public onlyOwner {
        if(!isExcluded(account)) revert Trnd__NotExcluded(account);
        excludeList[account] = false;
    }

    /* Getter Functions */
    
    function isBlacklisted(address account) public view returns (bool) {
        return blacklist[account];
    }

    function isExcluded(address account) public view returns (bool) {
        return excludeList[account];
    }

    function currentSnapshotId() external view returns (uint256) {
        return super._getCurrentSnapshotId();
    }

    function getDivitrendRewardsAddress() external view returns (address) {
        return _divRewardsAddress;
    }

    function getExchangeAddress() external view returns (address) {
        return _exchangeAddress;
    }

    function getFounderWallet() external view returns (address) {
        return founderWallet;
    }

    function getLiquidityWallet() external view returns (address) {
        return liquidityWallet;
    }

    function getStakedCapitalWallet() external view returns (address) {
        return stakedCapitalWallet;
    }

    function getStakedCapPerc() external view returns (uint256) {
        return stakedCapPerc;
    }

    function getFounderPerc() external view returns (uint256) {
        return founderPerc;
    }

    function getLiquidityPerc() external view returns (uint256) {
        return liquidityPerc;
    }

    function getSwapThreshold() external view returns (uint256) {
        return swapThreshold;
    }

    function getAutoSwap() external view returns (bool) {
        return autoSwap;
    }

    function getRouterAddress() external view returns (address) {
        return address(uniswapV2Router02);
    }

    function getPairAddress() external view returns (address) {
        return address(uniswapV2Pair);
    }

    function getCollectedTaxes() external view returns (uint256) {
        return collectedTaxes;
    }

    function getBuyTax() external view returns (uint256) {
        return buyTax;
    }

    function getSellTax() external view returns (uint256) {
        return sellTax;
    }

    function getUniswapV2Pair() external view returns (address) {
        return address(uniswapV2Pair);
    }

    function getUniswapV2Factory() external view returns (address) {
        return address(uniswapV2Factory);
    }

    /* Internal Functions */

    function _transfer(
        address sender,
        address recipient,  
        uint256 amount
    ) internal override virtual whenNotPaused {
        if(isBlacklisted(msg.sender)) revert Trnd__BlacklistedAddress(msg.sender);
        if(isBlacklisted(tx.origin)) revert Trnd__BlacklistedAddress(tx.origin);
        if(isBlacklisted(recipient)) revert Trnd__BlacklistedAddress(recipient);
        bool isBuyOrSell = sender == address(uniswapV2Pair) || sender == _exchangeAddress || recipient == address(uniswapV2Pair) || recipient == _exchangeAddress;
        bool isBuy = sender == address(uniswapV2Pair) || sender == _exchangeAddress;
        bool isSell = recipient == address(uniswapV2Pair) || recipient == _exchangeAddress;
        uint112 reserve0 = 0;
        uint112 reserve1= 0;
        
        if(address(uniswapV2Pair) != address(0)){
            try uniswapV2Pair.getReserves() returns (uint112 _reserve0, uint112 _reserve1, uint32) {
            reserve0 = _reserve0;
            reserve1 = _reserve1;
        } catch { } }// ignore 

        // Handle tax
        if(!isExcluded(sender) && !isExcluded(recipient) && isBuyOrSell) {            
            amount = handleTax(sender, recipient, amount);   
        }
        // Keeping track of swaps to calculate average price on frontend
        if(isBuy) {
            emit Swapped(recipient, amount, true, reserve0, reserve1);
        } else if(isSell) {
            emit Swapped(sender, amount, false, reserve0, reserve1);
        }
        // Transfer amount
        super._transfer(sender, recipient, amount);
    }   

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override(ERC20, ERC20Snapshot, ERC20Pausable)
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    /* Private Functions */

    /**
      * @dev be sure to _approve amount first (tax)
      */
    function swapAndLiquify() private {
        IUniswapV2Router02 router = uniswapV2Router02;      
        if(collectedTaxes == 0) revert Trnd__ZeroCollectedTaxes();

        // Calculate tax tokens and liquidity tokens
        uint256 stakedCapTok = (collectedTaxes * stakedCapPerc) / DENOMINATOR; 
        uint256 founderTok = (collectedTaxes * founderPerc) / DENOMINATOR;
        uint256 liquidityTok = (collectedTaxes * liquidityPerc) / DENOMINATOR;

        uint256 startBalance = address(this).balance;

        address[] memory sellPath = new address[](2);
        sellPath[0] = address(this);
        sellPath[1] = router.WETH();
        
        // sell stakedCapTok for eth  
        router.swapExactTokensForETH(
            stakedCapTok,
            0,
            sellPath,
            address(this),
            block.timestamp
        );
        
        uint256 stakedCapETH = address(this).balance - startBalance;
        startBalance = address(this).balance;

        // sell founderTok for eth
        router.swapExactTokensForETH(
            founderTok,
            0,
            sellPath,
            address(this),
            block.timestamp
        );

        uint256 founderETH = address(this).balance - startBalance;
        startBalance = address(this).balance;

        // Divide liquidityTok by 2
        liquidityTok = liquidityTok / 2;

        // sell half liquidityTok for eth
        router.swapExactTokensForETH(
            liquidityTok,
            0,
            sellPath,
            address(this),
            block.timestamp
        );

        uint256 liquidityETH = address(this).balance - startBalance;
        
        // add to lp         
        router.addLiquidityETH{value: liquidityETH}(
            address(this),
            liquidityTok,
            0,
            0,
            liquidityWallet,
            block.timestamp
        );

        // Transfer eth to wallets
        (bool success, ) = stakedCapitalWallet.call{value: stakedCapETH}("");
        if(!success) revert Trnd__TransferFailed(stakedCapitalWallet);
        (success, ) = founderWallet.call{value: founderETH}("");
        if(!success) revert Trnd__TransferFailed(founderWallet);
    }

    function handleTax(address from, address to, uint256 amount) private returns (uint256) {
        uint256 tax;
        uint256 baseUnit = amount / 100;
        bool isBuy = from == address(uniswapV2Pair) || from == _exchangeAddress;
        bool isSell = to == address(uniswapV2Pair) || to == _exchangeAddress;

        if(isBuy) {
            tax = baseUnit * buyTax;    // if is a buy
        }
        else if(isSell) {
            tax = baseUnit * sellTax;   // if is a sell
        }

        // Transfer tax to contract and add to collected taxes
        _transfer(from, address(this), tax);
        collectedTaxes += tax;

        // Check if autoswap is active and contract's collected taxed are enough to swap and liquify
        if(autoSwap && collectedTaxes >= swapThreshold){ 
            // Approve tokens for swap and liquify
            _approve(address(this), address(uniswapV2Router02), collectedTaxes);

            // Swap and liquify
            swapAndLiquify();    

            // Reset collected taxes   
            collectedTaxes = 0;
        }

        amount -= tax; // deduct tax

        emit TaxHandled(amount, tax);
        
        return amount;
    }


}