import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Tooltip,
    CircularProgress,
    Grid,
    Paper,
    styled,
    TextField,
    FormControl,
    Collapse,
    Slider,
    useMediaQuery
} from '@material-ui/core';
import { EtherContext } from '../../ethers/EtherContext';
import { EtherContextRepository } from '../../ethers/EtherContextRepository';
import { makeStyles } from '@material-ui/core/styles';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import TokenSelector, { IAsset } from './TokenSelector';
import AddressFactory from '../../common/AddressFactory';
import EtherHelper from '../../ethers/EtherHelper';
import { ethers } from 'ethers';
import { StatsHelper } from '../stats_helper/StatsHelper';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Alert, AlertTitle } from "@mui/material";
import LogoSpinnerAnimation from '../LogoSpinnerAnimation';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
const PrettoSlider = styled(Slider)({
    color: '#52af77',
    height: 8,
    width: '80%',
    position: 'relative',
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 30,
        width: 30,
        marginTop: -12,
        backgroundImage: "url('Android.png')",
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 8,
        background: 'unset',
        padding: 0,
        width: 22,
        height: 22,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#52af77',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
        },
        '& > *': {
        },
    },
});

const useStyles = makeStyles((theme) => ({
    swapContainer: {
        borderRadius: '8px',
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        width: '100%'
    },
    root: {
        position: "relative",
        width: "100%",
        overflow: "auto",
        background: 'linear-gradient(135deg, #000000, #0B0230)',
        marginLeft: 0,
        marginRight: 0,
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: 'linear-gradient(135deg, #000000, #0B0230)',
            backdropFilter: "blur(10px)",
            zIndex: -1,
        },
        "@media screen and (max-width: 768px)": {
            height: "100vh",
        },
    },
    paperA: {
        position: "relative",
        top: '13%',
        minHeight: 400,
        maxWidth: 'auto',
        background: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(18, 17, 17, 0.7))",
        padding: theme.spacing(2),
        border: '2px solid #8A00F6',
        textAlign: "center",
        justifyContent: 'center',
        display: 'flex',
        backgroundClip: 'padding-box',
        borderRadius: 25,
        "@media screen and (max-width: 768px)": {
            minHeight: 100,
        },
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
        zIndex: 0,
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    inputLeftAddon: {
        fontSize: '14px',
        marginTop: theme.spacing(1),
        color: 'white',
        marginRight: theme.spacing(1),
    },
    infoIcon: {
        marginTop: 0,
        marginRight: theme.spacing(1),
        fontSize: '20px',
        color: 'white'
    },
    divider: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        flexGrow: 1,
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(0),
        color: 'white'
    },
    swapButton: {
        width: '100%',
        margin: theme.spacing(0),
        marginTop: theme.spacing(10),
        color: 'white',
        background: '#8B3EFF',
        border: '2px solid #8B3EFF',
        '&:hover': {
            background: '#8B3EFF',
            color: 'black'
        },
    },
    impact: {
        color: "#A4FE66",
        textShadow: "3px 3px 2px rgba(0, 0, 0, 0.5)",
        fontSize: '16px',
        fontStyle: 'italic'
    },
    balanceIn: {
        color: "lightgray",
        textShadow: "3px 3px 2px rgba(0, 0, 0, 0.5)",
        fontSize: '16px',
        fontStyle: 'italic'
    },
    impactDown: {
        color: "red",
        textShadow: "3px 3px 2px rgba(0, 0, 0, 0.5)",
        fontSize: '16px',
        fontStyle: 'italic'
    },
    balanceOut: {
        color: "white",
        textShadow: "3px 3px 2px rgba(0, 0, 0, 0.5)",
        fontSize: '16px'

    },
    customTextField: {
        minWidth: 200,
        borderRadius: 8,
        color: '#8B3EFF',
        '& input': {
            color: 'white', // Testo bianco
        },
    },
    paperAlert: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        background: 'rgba(17, 17, 17, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '2px solid transparent',
        borderTop: 'none',
        borderRight: 'none',
        borderLeft: 'none',
        borderBottom: 'none',
        borderImage: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%) 1',
        borderRadiusTopRight: 100,
        borderRadiusTopLeft: 100,
        position: 'fixed',
        zIndex: 9999,
        width: '100%',
        minHeight: 10,
        height: 'auto',
        maxHeight: 'auto',
        top: 55,
    },
}));

const ShuffleTokenSelectors = ({ onTokenSwap }: { onTokenSwap: () => void }) => {
    return (
        <IconButton
            aria-label="Shuffle Token Selectors"
            onClick={onTokenSwap}
            style={{ color: 'white' }}
        >
            <ShuffleIcon />
        </IconButton>
    );
};

const SwapSection = () => {
    const { context, saveContext } = React.useContext(EtherContext) as EtherContextRepository;

    const natives: IAsset[] = [
        { name: "Ethereum", symbol: "WETH", address: AddressFactory.getWETH(context.chainId ?? 11155111), logo: '74.png', disabled: false },
    ];
    const tokens: IAsset[] = [
        { name: "DiviTrend", symbol: "TRND", address: AddressFactory.getTokenAddress(context.chainId ?? 11155111), logo: '78.png', disabled: false },
    ];

    const [balanceOut, setBalanceOut] = useState("");

    const [amount, setAmountIn] = useState<number | undefined>(0);
    const [amountOut, setAmountOut] = useState<number | undefined>(0);
    const [sliderValue, setSliderValue] = useState<number | undefined>(0);

    const [assetIn, setAssetIn] = useState<IAsset>(natives[0]);
    const [assetOut, setAssetOut] = useState<IAsset>(tokens[0]);

    const [disabled, setDisabled] = useState(false);
    const [swapLoading, setSwapLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [wethPrice, setWethPrice] = useState<number | undefined>(undefined);
    const [reserveWETH, setWETHReserve] = useState<number>(0);
    const [alertInfo, setAlertInfo] = useState<{ severity: "success" | "error", message: string } | null>(null);
    const [balanceNative, setBalanceNative] = useState<number>(0);
    const [tokenLists, setTokenLists] = useState([natives, tokens]);
    const isMobile = useMediaQuery("(max-width:960px)");

    const handleCloseAlert = () => {
        setAlertInfo(null);
    };

    const handleTokenSwap = () => {
        setTokenLists([tokenLists[1], tokenLists[0]]);
        setAssetIn(tokenLists[1][0]);
        setAssetOut(tokenLists[0][0]);
        console.log("In and Out", tokenLists[1][0], tokenLists[0][0])
        console.log("TOKEN LIST", [tokenLists[1], tokenLists[0]])
    };

    const isConnected = context.connected ?? false;

    useEffect(() => {
        if (!context) return context
        const res_weth = Number(context.reserve0)
        setWETHReserve(res_weth)
        setBalanceNative(context.balance ?? 0)
    }, [context])
    useEffect(() => {
        StatsHelper.getPriceOfToken('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') // Indirizzo di WETH
            .then(price => setWethPrice(price));
    }, []);

    useEffect(() => {
        if (amount && context.chainId) {
            setLoading(true)
            setSliderValue(parseInt((amount * ((context.balance ?? 1) / 100)).toFixed(2)));
            let isETH: boolean = assetOut.symbol === 'TRND' ? true : false;
            EtherHelper.getQuote(amount, (assetOut.address ?? ''), (assetIn.address ?? ''), context.chainId, isETH, context).then((n) => { setAmountOut(n); });
            setLoading(false)

        } else {
            setAmountOut(0);
            setSliderValue(0);
            setLoading(false)

        }
    }, [amount, assetOut, context, assetIn]);

    useEffect(() => {
        if (assetOut.address && context.addressSigner) {
            EtherHelper.getBalance(assetOut.address, context.addressSigner).then(a => setBalanceOut(`${a.toLocaleString(undefined, { maximumFractionDigits: 2 })}`));
        }
    }, [assetOut, context.addressSigner]);

    async function swap() {
        setDisabled(true);
        setSwapLoading(true);
        setLoading(true);
        EtherHelper.swap({ ...context, swapAmount: amount, swapToken: assetOut }).then((ctx) => {
            setLoading(true)
            setAmountIn(0);
            setAmountOut(0);
            setSliderValue(0);
            saveContext(ctx);
            setDisabled(false);
            setSwapLoading(false);
            setLoading(false);
            if (ctx.toastStatus === 'success') {
                setAlertInfo({ severity: 'success', message: ctx.toastDescription ?? '' });
                setLoading(false)
            } else {
                setAlertInfo({ severity: 'error', message: ctx.toastDescription ?? '' });
                setLoading(false)
            }
            if (assetOut.address && context.addressSigner) {
                EtherHelper.getBalance(assetOut.address, context.addressSigner).then(a => setBalanceOut(`${a.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${assetOut.symbol}`));
            }

        });
    }

    useEffect(() => {
        async function getInitDataPool() {
            const data_ctx = await EtherHelper.initialInfoPool(context);
            saveContext(data_ctx)
            console.log(data_ctx)
        }
        getInitDataPool()
    }, [])


    function isDisabled(): boolean {
        if (!context?.connected ?? true) return true;

        return false;
    }

    const calculatePriceImpact = (amountIn: number) => {
        const reserves = Number(ethers.utils.formatEther(context.reserve0 ?? 0));
        const priceImpact = (amountIn / (reserves + amountIn)) * 100;
        return priceImpact;
    }

    const classes = useStyles();

    //CONVERT BALANCE OUTPUT
    const cleanedStringOutput = balanceOut.replace(/[,.]/g, '');

    const numericString = cleanedStringOutput.replace(',', '.');

    const OutPutBalance = parseFloat(numericString);
    const balancePercentage = (((amount ?? 0) / (assetIn.name !== 'Ethereum' ? balanceNative : OutPutBalance)) * 100).toFixed(1);
    const res_0 = Number(parseFloat(context.reserve0 ?? '0'));
    const res_1 = Number(parseFloat(context.reserve1 ?? '0'));
    //const price = res_0 / res_1; // WETH/TRND
    const priceImpact = calculatePriceImpact(amount ?? 0);
    const priceImpactClass = priceImpact <= 1 ? classes.impact : classes.impactDown;
    const PriceImpactIcon = priceImpact <= 1 ? ArrowDropUpIcon : ArrowDropDownIcon;
    return (
        <div className={classes.root}>
            <div className={classes.overlay} ></div>

            {alertInfo !== null && (

                <Paper elevation={3} className={classes.paperAlert}>
                    <Alert
                        variant="outlined"
                        severity={alertInfo?.severity || "info"}
                        onClose={handleCloseAlert}
                    >
                        <AlertTitle>{alertInfo?.severity === "error" ? "Error" : "Success"}</AlertTitle>
                        {alertInfo?.message}
                    </Alert>
                </Paper>
            )}
            <Collapse in={loading !== false}>
                <Paper>
                    <LogoSpinnerAnimation loading={loading} />
                </Paper>
            </Collapse>
            <Grid container style={{ marginBottom: isMobile ? 200 : 100, maxWidth: 540 }}>
                <Grid item xs={12} md={12} style={{ margin: 10, padding: 10 }}>
                    <Paper className={classes.paperA}>
                        <Box
                            className={classes.swapContainer}
                            style={{ justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Box>
                                <Grid
                                    container
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        width: '100%',
                                        marginTop: 10,
                                        marginBottom: 50,
                                        gap: 10,
                                        padding: 10,
                                    }}
                                    spacing={2}
                                >
                                    <FormControl>
                                        {loading && <CircularProgress />}
                                        {!loading && (
                                            <TextField
                                            label={<div style={{ fontSize: '18px', color: '#8B3EFF' }}>From</div>}
                                            type="text"
                                            className={classes.customTextField}
                                            inputProps={{
                                                max: assetIn.name === 'DiviTrend' ? context.balance : balanceOut,
                                            }}
                                            value={amount?.toLocaleString(undefined, { maximumFractionDigits: assetIn.name === 'DiviTrend' ? 2 : 4 }) ?? ''}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                const filteredValue = inputValue.match(/^[0-9]*[.,]?[0-9]*$/); // Allow only one dot or comma
                                                if (filteredValue) {
                                                    console.log("SetAmountIn: ", Number(filteredValue[0].replace(',', '.')));
                                                    setAmountIn(Number(filteredValue[0].replace(',', '.'))); // Replace comma with dot before converting to number
                                                }
                                            }}
                                            focused
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{ minWidth: 200 }}
                                        />
                                        )}
                                    </FormControl>
                                    <TokenSelector
                                        assets={tokenLists[0]}
                                        disabled={disabled || isDisabled()}
                                        onChange={setAssetOut}
                                    />
                                </Grid>
                                <div style={{ display: 'flex', position: 'absolute', left: "15%", top: isMobile ? '25%' : '22%' }}>
                                    <Tooltip
                                        title="Price Impact"
                                        placement="top"
                                        arrow
                                    >
                                        <div>
                                            <PriceImpactIcon className={priceImpactClass} />
                                            <Typography variant="caption" className={priceImpactClass}>
                                                {priceImpact.toFixed(0)}%
                                            </Typography>
                                        </div>
                                    </Tooltip>
                                </div>
                                <div style={{ display: 'flex', position: 'absolute', flexDirection: 'row', right: "20%", top: isMobile ? '30%' : '22%' }}>
                                    <AccountBalanceWalletIcon fontSize="small" style={{ color: 'white', marginTop: 1, marginRight: 10 }} />
                                    <Typography variant="caption" className={classes.balanceIn}>
                                        {assetIn.name === 'Ethereum' ? (context.balance?.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })) : context.trndBalance?.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })
                                        }
                                    </Typography>
                                </div>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    style={{
                                        marginTop: isMobile ? 100 : 20,
                                        justifyContent: 'center',
                                        display: 'flex',
                                        gap: 10,
                                        padding: 5,
                                        width: '100%',
                                    }}
                                >
                                    <PrettoSlider
                                        aria-label="pretto-slider"
                                        defaultValue={sliderValue}
                                        step={assetIn.name !== 'Ethereum' ? (1/1000) : (1 / 1000)}
                                        min={0}
                                        max={assetIn.name === 'Ethereum' ? balanceNative : context.trndBalance}
                                        value={assetIn.name === 'Ethereum' ? Number(amount?.toFixed(2)) : Number(amount?.toFixed(2))}
                                        valueLabelFormat={() => `${balancePercentage}%`}
                                        onChange={(event: any, newValue: number | number[]) => {
                                            const amountWithCorrectDecimals = parseFloat(newValue.toString());
                                            console.log("FROM - Amount", assetIn.name, amountWithCorrectDecimals)
                                            setAmountIn(isNaN(amountWithCorrectDecimals) ? undefined : amountWithCorrectDecimals);
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    container
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    className={classes.divider}
                                >
                                    <ShuffleTokenSelectors onTokenSwap={handleTokenSwap} />
                                </Grid>
                                <Grid
                                    container
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        width: '100%',
                                        marginTop: isMobile ? 20 : 50,
                                        gap: 10,
                                        padding: 10,
                                    }}
                                    spacing={2}
                                >
                                    <FormControl style={{ display: 'flex', justifyContent: 'center' }}>
                                        {loading && <CircularProgress />}
                                        {!loading && (
                                            <TextField
                                                label={<div style={{ fontSize: '18px', color: '#8B3EFF' }}>To</div>}
                                                type="text"
                                                className={classes.customTextField}
                                                value={amountOut?.toLocaleString(undefined, {
                                                    maximumFractionDigits: 4,
                                                })} hiddenLabel={false}

                                                focused
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                style={{ minWidth: 200 }}
                                            />
                                        )}
                                    </FormControl>
                                    <TokenSelector
                                        assets={tokenLists[1]}
                                        disabled={disabled || isDisabled()}
                                        onChange={setAssetOut}
                                    />

                                </Grid>
                                <div style={{ display: 'flex', position: 'absolute', left: "15%", bottom: isMobile ? '20%' : '25%', flexDirection: 'row' }}>
                                    <Tooltip
                                        title="Estimated quote, taxes not included"
                                        placement="top"
                                        arrow
                                    >
                                        <InfoOutlinedIcon className={classes.infoIcon} />
                                    </Tooltip>
                                    <Typography variant="caption" className={classes.balanceIn}>
                                        {assetIn.name === 'Ethereum'
                                            ? (amount === 0
                                                ? 0
                                                : ((amount ?? 0) * (wethPrice ?? 0)).toFixed(2)
                                            )
                                            : (amount === 0
                                                ? 0
                                                : ((amountOut ?? 0) * (wethPrice ?? 0)).toFixed(2)
                                            )
                                        }$
                                    </Typography>
                                </div>
                                <div style={{ display: 'flex', position: 'absolute', flexDirection: 'row', right: "20%", bottom: isMobile ? '15%' : '25%' }}>
                                    <AccountBalanceWalletIcon fontSize="small" style={{ color: 'white', marginTop: 1, marginRight: 10 }} />
                                    <Typography variant="caption" className={classes.balanceIn}>
                                        {assetIn.name === 'DiviTrend' ? (context.balance?.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })) : (balanceOut)
                                        }
                                    </Typography>
                                </div>

                                <Button
                                    variant="contained"
                                    className={classes.swapButton}
                                    onClick={() => swap()}
                                    disabled={disabled || isDisabled() || (amount === undefined || Number(amount) === 0)}
                                >
                                    SWAP
                                    <ShuffleIcon style={{ marginLeft: 10 }} />
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid >
        </div >
    );
};

export default SwapSection;
