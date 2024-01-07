// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

interface IDivitrend {
    function depositTax(uint256 taxAmount) external payable;

    function createSnapshot() external;

    function pause() external;

    function unpause() external;

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function enableBlacklist(address account) external;

    function disableBlacklist(address account) external;

    function setBuyTax(uint8 tax) external;

    function setSellTax(uint8 tax) external;

    function setDivitrendRewardsAddress(address account) external;

    function setExchangeAddress(address account) external;

    function setFounderWallet(address account) external;

    function setLiquidityWallet(address account) external payable;

    function setStakedCapitalWallet(address account) external;

    function setStakedCapPerc(uint16 perc) external;

    function setFounderPerc(uint16 perc) external;

    function setLiquidityPerc(uint16 perc) external;

    function setSwapThreshold(uint256 amount) external;

    function setAutoSwap(bool value) external;

    function setRouterAddress(address account) external;

    function manualSwapAndLiquify() external;

    function withdrawETH() external;

    function withdrawTokens(address tokenAddress) external;

    function exclude(address account) external;

    function removeExclude(address account) external;

    function isBlacklisted(address account) external view returns (bool);

    function isExcluded(address account) external view returns (bool);

    function currentSnapshotId() external view returns (uint256);

    function getDivitrendRewardsAddress() external view returns (address);

    function getExchangeAddress() external view returns (address);

    function getFounderWallet() external view returns (address);

    function getLiquidityWallet() external view returns (address);

    function getStakedCapitalWallet() external view returns (address);

    function getStakedCapPerc() external view returns (uint256);

    function getFounderPerc() external view returns (uint256);

    function getLiquidityPerc() external view returns (uint256);

    function getSwapThreshold() external view returns (uint256);

    function getAutoSwap() external view returns (bool);

    function getRouterAddress() external view returns (address);

    function getPairAddress() external view returns (address);

    function getCollectedTaxes() external view returns (uint256);

    function getBuyTax() external view returns (uint256);

    function getSellTax() external view returns (uint256);

    function getUniswapV2Pair() external view returns (address);

    function getUniswapV2Factory() external view returns (address);
}
