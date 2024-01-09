/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Paper from "@material-ui/core/Paper";
import Grid from "@mui/material/Grid";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
//import Chip from "@mui/material/Chip";
import { Box, Button, Icon, Typography, useMediaQuery } from "@material-ui/core";
import { EtherContext } from "../../../ethers/EtherContext";
import { EtherContextRepository } from "../../../ethers/EtherContextRepository";
import { useStyleStaking } from "./useStyleStaking";
import TimerIcon from '@mui/icons-material/Timer';
import AddIcon from '@mui/icons-material/Add';
import { PrettoSlider } from "./useStyleStaking";
import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Alert, AlertTitle, Collapse, IconButton, Skeleton } from "@mui/material";
import LogoSpinnerAnimation from "../../LogoSpinnerAnimation";
import EtherHelper from "../../../ethers/EtherHelper";
import { IEtherContext } from "../../../ethers/IEtherContext";
import { BigNumber, ethers } from "ethers";
import { SettingsEthernetTwoTone } from "@mui/icons-material";
import { IClaimETH } from "../../../entities/IClaimETH";
import { StatsHelper } from "../../stats_helper/StatsHelper";
import BoosterStaked from "./BoosterStaked";
import ModalStaking from "./ModalStaking";
import { NftStake } from "../../../entities/IStaking";
import { useTokenAttributeCalculator } from "./comp_modal/TokenAttributeCalculator";
import { Link } from "react-router-dom";
import ModalExit from "./ModalExit";

interface StakingLeftProps {
    vesting: number;
}

interface INFTBoost {
    fact_boost: number;
    fact_rev: number;
}

interface IOptData {
    vestingTime: number;
    apy: number;
    max_nft_slot: number;
    lastChange: number;
}

const useCountdown = (startTime: number, durationInSeconds: number) => {
    const [countdown, setCountdown] = useState<number>(0);

    useEffect(() => {
        const endTime = startTime + durationInSeconds;

        const interval = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const difference = endTime - now;

            if (difference <= 0) {
                clearInterval(interval);
                setCountdown(0);
            } else {
                setCountdown(difference);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, durationInSeconds]);

    return countdown;
};

export const StakingLeft: React.FC<StakingLeftProps> = ({ vesting }) => {
    const { context, saveContext } = React.useContext(EtherContext) as EtherContextRepository;
    const [userDeposit, setUserDeposit] = useState('');
    const rewards = Number(context.trnd_to_claim?.toFixed(2))
    const [comp, setComp] = useState(0); // Percentuale iniziale sulla slider - settata a 0 — todo: collegare a func per claimare
    const [compound, setCompound] = useState((rewards * comp) / 100);
    const [claim, setClaim] = useState(rewards - compound);
    const claimTRND = rewards - compound
    const [loading, setIsLoading] = useState(false);
    const [alertInfo, setAlertInfo] = useState<{ severity: "success" | "error", message: string } | null>(null);
    const [APY, setAPY] = useState(0)
    const [vestingTime, setVestingTime] = useState(0)
    const [maxNftSlot, setMaxNftSlot] = useState(0)
    const [startTimePending, setStartTime] = useState(0)
    const vestingTimeRes = startTimePending + vestingTime; // Calcolare il timestamp di fine
    const countdownSeconds = useCountdown(startTimePending, vestingTime);
    const seconds = countdownSeconds % 60;
    const minutes = Math.floor((countdownSeconds / 60) % 60);
    const hours = Math.floor((countdownSeconds / 3600) % 24);
    const days = Math.floor(countdownSeconds / (3600 * 24));
    const [months, setMonths] = useState('')
    const countdown = `${days}d - ${hours}h - ${minutes}m`;
    const countdownTitle = `${days} DAY${days !== 1 ? 'S' : ''} ${hours} HOUR${hours !== 1 ? 'S' : ''} ${minutes} MINUTE${minutes !== 1 ? 'S' : ''}`;
    const res_0 = Number(parseFloat(context.reserve0 ?? '0'));
    const res_1 = Number(parseFloat(context.reserve1 ?? '0'));
    const priceTRND = res_0 / res_1;
    const [ethRev, setEthRev] = useState(0);
    const [nftEthRev, setNftEthRev] = useState(0);
    const [uriStaked, setUriStaked] = useState([] as { uri: string, id: number, attributes: [{ trait_type: string, value: string }] }[] | undefined)
    const [nftBoostData, setnftBoostData] = useState<INFTBoost>(
        {
            fact_boost: 0,
            fact_rev: 0
        }
    );
    const [openModal, setOpenModal] = useState(false);
    const [openModalExit, setOpenModalExit] = useState(false);
    const [externalButton, setExternalButton] = useState(0);
    const [alreadyStakedToFetch, setAlreadyStaked] = useState([] as number[])
    const [malusPerc, setMalusPerc] = useState(0)

    const handleButtonClick = (n: number) => {
        setOpenModal(true);
        setExternalButton(n);
    };

    const handleModalExit = () => {
        setOpenModalExit(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setExternalButton(0);
    };

    const handleCloseModalExit = () => {
        setOpenModalExit(false);
        setExternalButton(0);
    };

    const [wethPrice, setWethPrice] = useState<number | undefined>(undefined);

    /* STYLE */
    const classes = useStyleStaking();
    const isMobile = useMediaQuery("(max-width:960px)");

    const handleCloseAlert = () => {
        setAlertInfo(null);
    };

    function egPrice(trnd: string | undefined): string {
        const res = Number(trnd) * priceTRND
        return res.toFixed(4)
    }

    //console.log(vesting - 1) - consider vesting -1 for contract

    const vestingData = async () => {
        try {
            const optData = await EtherHelper.STAKING_OPT_DATA(vesting - 1, context) as IOptData
            setAPY(optData.apy)
            setVestingTime(optData.vestingTime)
            setMaxNftSlot(optData.max_nft_slot)
        } catch (e) {
            console.log("error in timeLeft for ", vesting, e)
        }
    }



    const stakingDataRew = async () => {
        try {
            const dataRew = await EtherHelper.STAKING_DATA_REW_TRND(vesting - 1, context)
            if (dataRew && dataRew.user_pending_time && dataRew.user_pending_trnd) {
                setStartTime(dataRew.user_pending_time.toNumber())
                setUserDeposit(dataRew.user_pending_trnd.toFixed(2))
            }
        } catch (e) {
            console.log("error on stakingDataRew: ", e)
        }
    }

    const stakingPendingRew = async (vestingN: number) => {
        try {
            const ctx = await EtherHelper.STAKING_PENDING_REW(vestingN !== 0 ? vestingN - 1 : 0, context)
            saveContext(ctx)
        } catch (e) {
            console.log("error on stakingPendingRew: ", e)
        }
    }

    const actualMalus = async (vestingN: number) => {
        try {
            const perc_malus = await EtherHelper.STAKING_GET_ACTUAL_MALUS(vestingN !== 0 ? vestingN - 1 : 0, context)
            setMalusPerc(perc_malus)
        } catch (e) {
            console.log("error on stakingPendingRew: ", e)
        }
    }

    const userRevShare = async () => {
        try {
            const data = await EtherHelper.STAKING_REV_SHARE(context) as IClaimETH[]
            console.log("data: ", data)
            if (data && data[0] !== undefined) {
                setEthRev(data[0].eth_rew ?? 1)
                setNftEthRev(data[0].nft_eth_rew ?? 1)
                console.log("data: ", data[0].eth_rew, data[0].nft_eth_rew)
            }
        } catch (e) {
            console.log("error on stakingPendingRew: ", e)
        }
    }

    const nftUserData = async () => {
        try {
            const ctx = await EtherHelper.STAKING_NFT_DATA(vesting - 1, context)
            saveContext(ctx)
        } catch (e) {
            console.log("error on stakingPendingRew: ", e)
        }
    }

    const factories_data_boost = async () => {
        try {
            if (!context) return
            const ctx = await EtherHelper.FACTORIES_TOTAL_REV(context)
            if (ctx) {
                setnftBoostData(ctx as INFTBoost);
            }
            setIsLoading(false)
        } catch (e) {
            console.log("error in NFTBoost: ", e);
        }
    }

    /* FUNC */

    const compoundAndClaim = async () => {
        setIsLoading(true)
        try {
            await EtherHelper.STAKING_CLAIM(vesting - 1, comp, context)
                .then((ctx) => {
                    saveContext({ ...ctx, reload: true })
                    setIsLoading(false)
                    if (ctx.toastStatus === 'success') {
                        setAlertInfo({ severity: 'success', message: ctx.toastDescription ?? '' })
                    }
                    if (ctx.toastStatus === 'error') {
                        setAlertInfo({ severity: 'error', message: ctx.toastDescription ?? '' })
                    }
                })
        } catch (e) {
            console.log("error in compoundAndClaim: ", e)
        } finally {
            setIsLoading(false)
        }
    }

    const claimETH = async () => {
        setIsLoading(true)
        try {
            await EtherHelper.STAKING_CLAIM_ETH(context)
                .then((ctx) => {
                    saveContext({ ...ctx, reload: true })
                    setIsLoading(false)
                    userRevShare()
                    if (ctx.toastStatus === 'success') {
                        setAlertInfo({ severity: 'success', message: ctx.toastDescription ?? '' })
                    }
                    if (ctx.toastStatus === 'error') {
                        setAlertInfo({ severity: 'error', message: ctx.toastDescription ?? '' })
                    }
                })
        } catch (e) {
            console.log("error in claimETH: ", e)
        } finally {
            setIsLoading(false)
        }
    }

    const exitStaking = async () => {
        try {
            await EtherHelper.STAKING_EXIT(vesting - 1, context)
                .then((ctx) => {
                    saveContext({ ...ctx, reload: true })
                    setIsLoading(false)
                    if (ctx.toastStatus === 'success') {
                        setAlertInfo({ severity: 'success', message: ctx.toastDescription ?? '' })
                    }
                    if (ctx.toastStatus === 'error') {
                        setAlertInfo({ severity: 'error', message: ctx.toastDescription ?? '' })
                    }
                })
        } catch (e) {
            console.log("error in exitStaking: ", e)
        }
    }

    const handleExitStaking = async () => {
        handleCloseModalExit()
        setIsLoading(true)

        await compoundAndClaim()
            .then(() => {
                if (ethRev + nftEthRev > 0) {
                    claimETH().then(() => {
                        setIsLoading(false)
                    })
                }
                if (alreadyStakedToFetch.length > 0) {
                    handleUnstakeAll()
                }
                exitStaking()
                    .then(() => {
                        setIsLoading(false)
                    })
            })

    }

    const handleUnstakeAll = async () => {
        setIsLoading(true)
        unStakeBooster(alreadyStakedToFetch).then(() => {
            if (context.toastStatus === 'success') {
                setAlertInfo({ severity: "success", message: context.toastDescription ?? '' })
                setIsLoading(false)
            }
            if (context.toastStatus === 'error') {
                setAlertInfo({ severity: "error", message: context.toastDescription ?? '' })
                setIsLoading(false)
            }
        })
    }

    const unStakeBooster = async (ids: number[]) => {
        try {
            const ctx = await EtherHelper.UNSTAKING_BOOST(ids, vesting - 1, context);
            console.log('StakeBooster', ctx);
            saveContext({ ...ctx, reload: true });
            if (ctx.toastStatus) {
                setIsLoading(false)
            }
        } catch (e) {
            console.error('Error staking booster:', JSON.stringify(e));
        } finally {
            setIsLoading(false)
        }
    }

    /*endFUNC*/

    const handleUpgrade = async () => {
        stakingDataRew()
    }

    /* STATE - USE EFFECT */
    useEffect(() => {
        if (!context) return
    }, [])

    useEffect(() => {

        async function getSignerInfo() {
            await EtherHelper.querySignerInfo(context)
        }

        getSignerInfo()

    }, [context, context.FactoriesTokenIds, context.toastStatus]);

    useEffect(() => {
        async function getInitDataPool() {
            await EtherHelper.queryStakingInfo(context)
            const data_ctx = await EtherHelper.initialInfoPool(context);
            saveContext(data_ctx)
        }
        getInitDataPool()
    }, [])

    useEffect(() => {
        setCompound((Number(context.trnd_to_claim?.toFixed(2)) * comp) / 100);
        setClaim(Number(context.trnd_to_claim?.toFixed(2)) - ((Number(context.trnd_to_claim?.toFixed(2)) * comp) / 100));
    }, [comp, rewards]);

    useEffect(() => {
        StatsHelper.getPriceOfToken('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') // Indirizzo di WETH
            .then(price => setWethPrice(price));
    }, []);

    useEffect(() => {
        if (!context) return
        setUserDeposit('0')
        stakingDataRew()
    }, [vesting])

    useEffect(() => {
        handleUpgrade()
    }, [context])

    useEffect(() => {
        if (!context) return
        setIsLoading(true)
        userRevShare();
        nftUserData();
        actualMalus(vesting - 1)
        vestingData();
        stakingDataRew();
        stakingPendingRew(vesting);
        factories_data_boost();
        setMonths(EtherHelper.getVesting(vesting - 1));
        const interval = setInterval(() => {
            stakingPendingRew(vesting);
        }, 10000);

        return () => clearInterval(interval);
    }, [vesting]);

    useEffect(() => {
        if (!context) return

        async function getAlreadyStaked() {
            const alreadyStaked = await EtherHelper.STAKING_NFT_DATA_NOCTX(vesting - 1, context) as NftStake
            return alreadyStaked
        }

        getAlreadyStaked().then(async (alreadyStaked: NftStake) => {
            const staked = alreadyStaked.nft_staked_ids ?? []
            const uri_staked = alreadyStaked.nft_staked_ids?.map(async (id: number) => {
                const uri = await EtherHelper.getTokenURI(context, id);
                return { uri, id };
            }) as { uri: { image: string, attributes: [{ trait_type: string, value: string }] }; id: number }[] | undefined;

            const promise_uri = await Promise.all(uri_staked ?? [])
            setAlreadyStaked(staked)
            setUriStaked(promise_uri.map((uri) => {
                return { uri: uri.uri.image, id: uri.id, attributes: uri.uri.attributes }
            }))
        })

    }, [vesting, context])

    const { totalRevShare, totalApyBoost } = useTokenAttributeCalculator(alreadyStakedToFetch, context);

    if (vesting === 0) return <></>;
    return (
        <Paper className={classes.paperA} >
            <div className={classes.vestingOverlay}>
                <Collapse in={alertInfo !== null}>

                    <Paper elevation={3} className={classes.paperAlert}>
                        <Collapse in={alertInfo !== null}>
                            <Alert
                                variant="outlined"
                                severity={alertInfo?.severity || "info"}
                                onClose={handleCloseAlert}
                            >
                                <AlertTitle>{alertInfo?.severity === "error" ? "Error" : "Success"}</AlertTitle>
                                {alertInfo?.message}
                            </Alert>
                        </Collapse>
                    </Paper>
                </Collapse>
                <Collapse in={loading !== false}>
                    <Paper>
                        <LogoSpinnerAnimation loading={loading} />
                    </Paper>
                </Collapse>
                {!isMobile && (
                    <div>
                        <div className={classes.rewardsVesting}>{months + 'M'}</div>
                    </div>
                )}
                {isMobile && (
                    <div className={classes.rewardsVesting} style={{ fontSize: "16px" }}>{months + 'M'}</div>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className={classes.title}>
                    {startTimePending && context.trnd_to_claim !== undefined && context.trnd_to_claim > 0 && startTimePending > 0
                        ? countdownTitle
                        : 'Not Active'
                    }
                </div>
            </div>
            <div className={classes.claimableLeft} style={{ top: isMobile ? '10%' : '12%' }}>
                <Box
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        margin: 0,
                        gap: 10
                    }}
                >
                    {/* Contenuto a sinistra */}
                    <Box
                        style={{
                            position: isMobile ? 'static' : 'absolute',
                            left: 0,
                            top: 0,
                            minWidth: isMobile ? '100%' : '50%',
                            marginTop: isMobile ? 20 : 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ fontSize: 14, color: "#A4FE66", marginBottom: 10, display: 'flex', flexDirection: 'row' }}>
                            {startTimePending && context.trnd_to_claim !== undefined && context.trnd_to_claim > 0 && startTimePending > 0
                                ? countdown
                                : 'Not Active'
                            }
                            <TimerIcon fontSize="small" style={{ marginLeft: 10 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}>
                                {context.trnd_to_claim?.toFixed(2)}
                            </Typography>
                            <img src="Android.png" style={{ height: 16, width: 16, marginTop: 4, marginRight: 5 }} alt="" />
                            <Typography className={classes.subtitleLil} style={{ color: 'grey' }} variant="body2">
                                | {egPrice(context.trnd_to_claim?.toFixed(2))} $
                            </Typography>
                        </div>
                        <Button
                            size="small"
                            variant="outlined"
                            className={classes.pulsButton}
                            style={{
                                fontFamily: 'Open Sans',
                                color: '#8B3EFF',
                                border: '1px solid #8B3EFF',
                                marginTop: 20,
                            }}
                            onClick={() => compoundAndClaim()}
                        >
                            Compound & Collect
                        </Button>
                    </Box>
                    {/*Progressive bar*/}
                    <Box
                        style={{
                            position: isMobile ? 'static' : 'absolute',
                            right: 0,
                            top: 0,
                            minWidth: isMobile ? '100%' : '50%', // Larghezza piena su mobile
                            marginTop: isMobile ? 20 : 0, // Margine aggiunto solo su mobile
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >

                        <div>
                            <Box style={{ minWidth: 270, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}>Compound {comp.toFixed(1)}%
                                </Typography>
                                <Typography className={classes.subtitleLil2} style={{ color: 'grey' }} variant="body2">| Collect {(100 - comp).toFixed(1)}%
                                </Typography>
                            </Box>
                            <Box style={{ minWidth: 270, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}> {compound.toFixed(2)} TRND
                                </Typography>
                                <Typography className={classes.subtitleLil2} style={{ color: 'grey' }} variant="body2">| {claimTRND.toFixed(2)}  TRND
                                </Typography>
                            </Box>
                            <Typography className={classes.subtitleLil3} style={{ color: 'grey', marginBottom: 10 }} variant="body2">{egPrice(String(compound))}$ | {egPrice(String(claimTRND))}$
                            </Typography>
                            <PrettoSlider
                                aria-label="pretto slider"
                                defaultValue={1}
                                value={comp}
                                min={0}
                                step={1}
                                max={100}
                                onChange={(_, value) => setComp(value as number)}
                            />
                        </div>
                    </Box>
                </Box>
            </div>
            {/* STATS */}
            <Grid container style={{ marginTop: isMobile ? '430px' : '270px', padding: 20 }} spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box className={classes.boxGrid} style={{ width: '100%', height: '250px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', padding: 40 }}>
                        <Typography className={classes.subtitleLeft} variant="body1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                            STATS
                        </Typography>
                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>$TRND staked: </span>
                            <span style={{ color: 'lightgrey' }}>{context.tot_trnd_staked ? context.tot_trnd_staked?.toLocaleString('en-US') : 0}</span> {/*ADD TOTAL TRND*/}
                        </Typography>
                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>FACT staked: </span>
                            <span style={{ color: 'lightgrey' }}>{context.nft_staked}</span> {/*ADD TOTAL TRND*/}
                        </Typography>
                        <div style={{ width: '100%', alignItems: 'center', position: 'absolute', bottom: 10, left: '0%' }}>
                            <IconButton onClick={() => handleButtonClick(2)} style={{ color: '#A4FE66' }}>
                                <AddCircleOutlineIcon style={{ color: '#A4FE66' }} />
                            </IconButton>
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box className={classes.boxGrid} style={{ width: '100%', height: '250px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', padding: 40 }}>
                        <Typography className={classes.subtitleLeft} variant="body1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: 0 }}>
                            USER
                        </Typography>
                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>$TRND staked:</span>
                            <span style={{ color: 'lightgrey' }}>
                                {Number(userDeposit).toLocaleString('en-US')}
                            </span>
                        </Typography>
                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>APY:</span>
                            <span style={{ color: '#A4FE66' }}>{`${(APY / 100)}%` ?? <Skeleton />}</span>
                        </Typography>
                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>MALUS:</span>
                            <span style={{ color: '#A4FE66' }}>{`${malusPerc.toFixed(2)}%` ?? <Skeleton />}</span>
                        </Typography>
                        {userDeposit && Number(userDeposit) > 0 ? (
                        <div style={{ width: '100%', display: 'flex', marginTop: 15, justifyContent: 'center', alignItems: 'center', marginBottom: -15 }}>
                        <Button onClick={handleModalExit} size="small" variant='contained' style={{ fontFamily: "Open Sans", color: 'black', border: '1px solid black', minWidth: 100, background: '#A4FE66', textShadow: '1px 1px 2px white' , marginBottom: 0}}>
                                EXIT
                            </Button>
                        </div>
                        ) : (
                            <></>
                        )}
                        <div style={{ width: '100%', alignItems: 'center', position: 'absolute', bottom: 10, left: '0%' }}>
                            <IconButton onClick={() => handleButtonClick(5)} style={{ color: '#A4FE66' }}>
                                <AddCircleOutlineIcon style={{ color: '#A4FE66' }} />
                            </IconButton>
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box className={classes.boxGrid} style={{ width: '100%', height: '250px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', padding: 40 }}>
                        <Typography className={classes.subtitleLeft} variant="body1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: 0 }}>
                            FACTORIES
                        </Typography>
                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Staked:</span>
                            <span style={{ color: 'lightgrey' }}>{alreadyStakedToFetch.length}</span>
                        </Typography>
                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>APY Boost:</span>
                            <span style={{ color: '#A4FE66' }}>{totalApyBoost}%</span>
                        </Typography>
                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Rev Share:</span>
                            <span style={{ color: '#A4FE66' }}>{totalRevShare}%</span>
                        </Typography>
                        <div style={{ width: '100%', alignItems: 'center', position: 'absolute', bottom: 10, left: '0%' }}>
                            <IconButton onClick={() => handleButtonClick(4)} style={{ color: '#A4FE66' }}>
                                <AddCircleOutlineIcon style={{ color: '#A4FE66' }} />
                            </IconButton>
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box className={classes.boxGrid} style={{ height: '250px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', padding: 40 }}>
                        <Typography className={classes.subtitleLeft} variant="body1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: 0 }}>
                            REWARDS
                        </Typography>
                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>ETH</span>
                            <span style={{ color: 'lightgrey' }}>{ethRev + nftEthRev}</span>
                        </Typography>
                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Worth</span>
                            <span style={{ color: '#A4FE66' }}>{(Number((ethRev + nftEthRev).toFixed(1)) * Number((wethPrice ?? 0).toFixed(1))).toLocaleString('en-US')}$</span>
                        </Typography>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', padding: 5, gap: 10, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Button onClick={() => claimETH()} size="small" variant='contained' style={{ fontFamily: "Open Sans", color: 'black', border: '1px solid black', minWidth: 100, background: '#A4FE66', textShadow: '1px 1px 2px white' }}>
                                Collect
                            </Button>
                            <Link to="/swap">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    style={{
                                        fontFamily: 'Open Sans',
                                        color: '#A4FE66',
                                        border: '1px solid #A4FE66',
                                        minWidth: 100
                                    }}
                                >
                                    Swap
                                </Button>
                            </Link>
                        </div>

                        <div style={{ width: '100%', alignItems: 'center', position: 'absolute', bottom: 10, left: '0%' }}>
                            <IconButton onClick={() => handleButtonClick(3)} style={{ color: '#A4FE66' }}>
                                <AddCircleOutlineIcon style={{ color: '#A4FE66' }} />
                            </IconButton>
                        </div>
                    </Box>
                </Grid>
            </Grid>
            {/* QUI */}
            <ModalStaking open={openModal} onClose={handleCloseModal} externalButton={externalButton} context={context} />
            <ModalExit open={openModalExit} onClose={handleCloseModalExit} exitFunction={handleExitStaking} amountStaked={Number(userDeposit)} malusPerc={malusPerc} vesting={Number(months)}/>
            <BoosterStaked clickable={handleButtonClick} vesting={vesting} maxtokenIdsstaked={maxNftSlot} context={context} />
            <div style={{ height: 100 }} ></div>
        </Paper >
    )
}