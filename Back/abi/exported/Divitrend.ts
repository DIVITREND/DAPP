export const TRND_ABI = [
    "constructor()",
    "error Trnd__AlreadyBlacklisted(address)",
    "error Trnd__AlreadyExcluded(address)",
    "error Trnd__BlacklistedAddress(address)",
    "error Trnd__ContractNotPaused()",
    "error Trnd__ContractPaused()",
    "error Trnd__InvalidAmount()",
    "error Trnd__NotBlacklisted(address)",
    "error Trnd__NotExcluded(address)",
    "error Trnd__TaxExceedsLimit(uint256)",
    "error Trnd__TransferFailed(address)",
    "error Trnd__ZeroAddress()",
    "error Trnd__ZeroCollectedTaxes()",
    "event Approval(address indexed,address indexed,uint256)",
    "event OwnershipTransferred(address indexed,address indexed)",
    "event Paused(address)",
    "event Snapshot(uint256)",
    "event Swapped(address indexed,uint256,bool,uint256,uint256)",
    "event TaxDeposited(address indexed,uint256)",
    "event TaxHandled(uint256,uint256)",
    "event Transfer(address indexed,address indexed,uint256)",
    "event Unpaused(address)",
    "function allowance(address,address) view returns (uint256)",
    "function approve(address,uint256) returns (bool)",
    "function balanceOf(address) view returns (uint256)",
    "function balanceOfAt(address,uint256) view returns (uint256)",
    "function burn(uint256)",
    "function burnFrom(address,uint256)",
    "function createSnapshot()",
    "function currentSnapshotId() view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function decreaseAllowance(address,uint256) returns (bool)",
    "function depositTax(uint256) payable",
    "function disableBlacklist(address)",
    "function enableBlacklist(address)",
    "function exclude(address)",
    "function getAutoSwap() view returns (bool)",
    "function getBuyTax() view returns (uint256)",
    "function getCollectedTaxes() view returns (uint256)",
    "function getDivitrendRewardsAddress() view returns (address)",
    "function getExchangeAddress() view returns (address)",
    "function getFounderPerc() view returns (uint256)",
    "function getFounderWallet() view returns (address)",
    "function getLiquidityPerc() view returns (uint256)",
    "function getLiquidityWallet() view returns (address)",
    "function getPairAddress() view returns (address)",
    "function getRouterAddress() view returns (address)",
    "function getSellTax() view returns (uint256)",
    "function getStakedCapPerc() view returns (uint256)",
    "function getStakedCapitalWallet() view returns (address)",
    "function getSwapThreshold() view returns (uint256)",
    "function getUniswapV2Factory() view returns (address)",
    "function getUniswapV2Pair() view returns (address)",
    "function increaseAllowance(address,uint256) returns (bool)",
    "function isBlacklisted(address) view returns (bool)",
    "function isExcluded(address) view returns (bool)",
    "function manualSwapAndLiquify()",
    "function name() view returns (string)",
    "function owner() view returns (address)",
    "function pause()",
    "function paused() view returns (bool)",
    "function removeExclude(address)",
    "function renounceOwnership()",
    "function setAutoSwap(bool)",
    "function setBuyTax(uint8)",
    "function setDivitrendRewardsAddress(address)",
    "function setExchangeAddress(address)",
    "function setFounderPerc(uint16)",
    "function setFounderWallet(address)",
    "function setLiquidityPerc(uint16)",
    "function setLiquidityWallet(address) payable",
    "function setRouterAddress(address)",
    "function setSellTax(uint8)",
    "function setStakedCapPerc(uint16)",
    "function setStakedCapitalWallet(address)",
    "function setSwapThreshold(uint256)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function totalSupplyAt(uint256) view returns (uint256)",
    "function transfer(address,uint256) returns (bool)",
    "function transferFrom(address,address,uint256) returns (bool)",
    "function transferOwnership(address)",
    "function unpause()",
    "function withdrawETH()",
    "function withdrawTokens(address)"
  ]  