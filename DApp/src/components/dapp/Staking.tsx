import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@mui/material/Grid";
import { Box, Button, Divider, Icon, Typography, useMediaQuery } from "@material-ui/core";
import { EtherContext } from "../../ethers/EtherContext";
import { EtherContextRepository } from "../../ethers/EtherContextRepository";
import { StakingLeft } from "./Staking/StakingLeft";
import { StakingDash } from "./Staking/StakingDash";
import { IconButton } from "@material-ui/core";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Alert, AlertTitle, Collapse } from "@mui/material";
import LogoSpinnerAnimation from "../LogoSpinnerAnimation";
import { useStyleStaking } from "./Staking/useStyleStaking";
import StakingModal from "./Staking/StakingModal";
import EtherHelper from "../../ethers/EtherHelper";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        width: "100%",
        height: "140vh",
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
            height: "140vh",
        },
    },
    overlay: {
        position: "absolute",
        height: "100%",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
        zIndex: 0,
    },
    paper: {
        minHeight: 170,
        backgroundColor: "rgba(255, 255, 255, 0)",
        padding: theme.spacing(2),
        border: "2px solid transparent",
        borderRadius: 30,
        borderImage: 'linear-gradient(to right, #000000, #121111)',
        borderImageSlice: 1,
        textAlign: "center",
        position: "relative",
        borderLeft: 'none',
        borderRight: 'none',
    },
    paperUser: {
        minHeight: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
        padding: theme.spacing(2),
        border: "2px solid transparent",
        borderRadius: 30,
        borderImage: 'linear-gradient(to right, #000000, #121111)',
        borderImageSlice: 1,
        textAlign: "center",
        position: "relative",
        borderBottom: 'none',
        marginTop: 240
    },
    paperRew: {
        minHeight: 110,
        backgroundColor: "rgba(255, 255, 255, 0)",
        padding: theme.spacing(2),
        border: "2px solid rgba(216,178,167, 1)",
        borderRadius: 30,
        boxShadow: "0 3px 15px 2px rgba(255, 105, 135, 0.3)",
        textAlign: "center",
        position: "relative",
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
    },
    paperB: {
        minHeight: 170,
        backgroundColor: "rgba(255, 255, 255, 0)",
        padding: theme.spacing(2),
        border: "2px solid rgba(216,178,167, 1)",
        borderRadius: 30,
        borderLeft: 'none',
        borderRight: 'none',
        boxShadow: "0 3px 15px 2px rgba(255, 105, 135, 0.3)",
        textAlign: "center",
        position: "relative",
        justifyContent: 'center'
    },
    paperA: {
        minHeight: 900,
        background: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(18, 17, 17, 0.7))",
        padding: theme.spacing(2),
        border: '2px solid #8500FF',
        textAlign: "center",
        position: "relative",
        backgroundClip: 'padding-box',
        borderRadius: 25,
        "@media screen and (max-width: 768px)": {
            minHeight: 100,
        },
    },
    vestingOverlay: {
        content: '""',
        position: 'absolute',
        width: '90px',
        height: '90px',
        top: -15,
        left: -15,
        backgroundImage: "url('52.png')",
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        borderRadius: '50%',
        zIndex: 1,
        "@media screen and (max-width: 768px)": {
            content: '""',
            position: 'absolute',
            width: '50px',
            height: '50px',
            top: 0,
            left: 1,
            zIndex: 1,
        }
    },
    boxGrid: {
        padding: theme.spacing(2),
        background: "url('57.png') no-repeat center",
        backgroundOrigin: 'border-box',
        backgroundSize: '130% 120%',
        backgroundPosition: 'center',
        overflow: 'hidden',
        //border: '6px solid rgba(0, 0, 0, 1)',
        borderRadius: 23,
        position: 'relative',
        boxShadow: "0 -10px 7px rgba(255, 255, 255, 0)",
        textAlign: "center",
        "@media screen and (max-width: 768px)": {
        },
    },
    boxGridInactive: {
        padding: theme.spacing(2),
        backgroundOrigin: 'border-box',
        backgroundSize: '130% 120%',
        backgroundPosition: 'center',
        borderRadius: 30,
        borderBottom: 'none',
        boxShadow: "0 -10px 7px rgba(255, 255, 255, 0)",
        textAlign: "center",
        "@media screen and (max-width: 768px)": {
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
    title: {
        position: "absolute",
        top: "3%",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        color: "white",
        fontFamily: "Open Sans",
        fontSize: "18px",
        "@media screen and (max-width: 768px)": {
            width: '100%',
        },
    },
    rewards: {
        position: "absolute",
        top: "3%",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        color: "white",
        textShadow: "3px 3px 2px rgba(139, 62, 255, 0.5)",
        fontFamily: "Open Sans",
        fontSize: "22px",
        "@media screen and (max-width: 768px)": {
            width: '100%',
        },
    },
    rewardsVesting: {
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        color: "white",
        textShadow: "3px 3px 2px rgba(139, 62, 255, 0.5)",
        fontFamily: "Open Sans",
        fontSize: "20px",
        "@media screen and (max-width: 768px)": {
            width: '100%',
            right: '100%',
            top: "30%",
        },
    },
    desc: {
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        fontFamily: "Open Sans",
        fontSize: "16px",
        "@media screen and (max-width: 768px)": {
            width: '100%',
        },
    },
    claimable: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        background: "url('54.png') no-repeat center",
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 150%',
        backgroundPosition: 'center',
        padding: theme.spacing(2),
        //border: "2px solid #8500FF",
        //borderBottom: 'none',
        //borderTop: 'none',
        textAlign: "center",
        height: '140px',
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        "@media screen and (max-width: 768px)": {
            minHeight: 100,
        },
        overflow: 'hidden',
    },
    balance: {
        position: "absolute",
        top: "60%",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        textShadow: "0px 3px 2px rgba(255, 105, 135, 0.5)",
        fontFamily: "Open Sans",
        fontSize: "22px",
        display: 'flex',
        flexDirection: 'row',
        "@media screen and (max-width: 768px)": {
            width: '100%',
            justifyContent: 'center'
        },
    },
    subtitle: {
        color: "white",
        fontSize: "18px",
        textShadow: "0px 3px 2px rgba(139, 62, 255, 0.5)",
        fontFamily: "Open Sans",
    },
    subtitleLil: {
        color: "white",
        fontSize: "16px",
        fontFamily: "Open Sans",
    },
    subtitleLil2: {
        color: "white",
        fontSize: "14px",
        fontFamily: "Open Sans",
    },
    subtitleLil3: {
        color: "white",
        fontSize: "12px",
        fontFamily: "Open Sans",
    },
    icon: {
        position: "absolute",
        top: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        color: "#8B3EFF",
        "@media screen and (max-width: 768px)": {
            top: "30px",
            left: "10%",
        },
    },
    iconTimer: {
        position: "absolute",
        top: "25px",
        left: "68%",
        color: " rgba(139, 62, 255, 1)",
        "@media screen and (max-width: 768px)": {
        },
    },
    user: {
        position: "absolute",
        top: "0",
        right: "95%",
        height: 40,
        width: 40,
        transform: "translateX(-50%)",
        color: "rgba(216, 178, 167, 1)",
        "@media screen and (max-width: 768px)": {
            top: "35px",
            left: "50%",
        },
    },
    chipContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    mobile: {
        "@media screen and (max-width: 768px)": {
            marginTop: 100,
        },
    },
    gradientBox: {
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        maxWidth: '80%',
        maxHeight: '80%',
        borderRadius: '50%',
        border: '2px solid transparent',
    },
    compandcoll: {
        background: "url('52.png') no-repeat center",
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        color: 'white',
        fontSize: 12,
        width: '85px',
        height: '80px'
    },
    border: {
        position: 'absolute',
        width: 'calc(80px - 4px)',
        height: 'calc(80px - 4px)',
        border: '2px solid #A4FE66',
        borderRadius: '50%',
    },
    button: {
        width: '100px',
        height: '100px',
        position: 'relative',
        top: '-15px',
        left: '0px',
        right: '-10px',
        bottom: '-10px',
        borderRight: 'none',
        borderTop: 'none',
        borderRadius: '50%',
        fontSize: 16,
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
    },
    pulsButton: {
        animation: '$pulse 2s infinite',
        backgroundColor: 'rgba(0,0,0, 0)', // Colore verde
        color: 'white',
    },
    '@keyframes pulse': {
        '0%': {
            backgroundColor: 'rgba(0,0,0, 0)',
        },
        '50%': {
            backgroundColor: '#4CAF50',
            color: 'white'
        },
        '100%': {
            backgroundColor: 'rgba(0,0,0, 0)',
        },
    }
}));


const Staking = () => {
    const classes = useStyles();
    const isMobile = useMediaQuery("(max-width:960px)");
    //const [openDrawer, setOpenDrawer] = useState(false);
    const { context, saveContext } = React.useContext(EtherContext) as EtherContextRepository;
    //const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState(0);
    //const [rewards, setRewards] = useState(680); // Numero totale di rewards
    const [loading, setIsLoading] = useState(false);
    const [alertInfo, setAlertInfo] = useState<{ severity: "success" | "error", message: string } | null>(null);
    const [isStakingModalOpen, setIsStakingModalOpen] = useState(false);
    const [vesting, setVesting] = useState<number>(0)

    const handleClick = (buttonNumber: any) => {
        setSelectedButton(buttonNumber);
    };

    const handleCloseAlert = () => {
        setAlertInfo(null);
    };


    async function enter_staking(amount: number) {
        setIsLoading(true)
        console.log("trnd to enter:", amount)
        if (amount) {
            try {
                const ctx = await EtherHelper.STAKING_ENTER(amount, vesting, context)
                saveContext(ctx)
                if (ctx.toastStatus === 'success') {
                    setAlertInfo({ severity: 'success', message: ctx.toastDescription ?? '' });
                    setIsStakingModalOpen(false)
                } else {
                    setAlertInfo({ severity: 'error', message: ctx.toastDescription ?? '' });
                }
                setIsLoading(false)
            } catch (e: any) {
                console.log("Error on enter_staking: ", e)
                setIsLoading(false)
            }
        }
    }

    const approveTRND = async (amount: number) => {
        try {
            const tx = await EtherHelper.APPROVE_TRND(amount, context)
                .then((ctx) => {
                    saveContext({ ...ctx, reload: true })
                    if (ctx.toastStatus === 'success') {
                        setAlertInfo({ severity: 'success', message: ctx.toastDescription ?? '' })
                    }
                    if (ctx.toastStatus === 'error') {
                        setAlertInfo({ severity: 'error', message: ctx.toastDescription ?? '' })
                    }
                    return { ...ctx }
                })
            return tx
        } catch (e) {
            console.log("error in approveTRND: ", e)
            return context
        }
    }

    const handleEnterStaking = async (amount: number) => {
        setIsStakingModalOpen(false)
        setIsLoading(true)
        const approved = await approveTRND(amount)
        if (approved.toastStatus === 'success') {
            enter_staking(amount)
        }
    }

    const handleStakingModal = (vesting: number) => {
        setIsStakingModalOpen(true)
        setVesting(vesting)
    }

    return (
        <div className={classes.root} style={{ height: isMobile ? '100%' : '100%' }}>
            <div className={classes.overlay}></div>
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

            <StakingModal
                open={isStakingModalOpen}
                onClose={() => setIsStakingModalOpen(false)}
                balance={context.trndBalance ?? 0}
                stakeFunction={handleEnterStaking}
                vesting={vesting}
            />

            <Grid container spacing={2} style={{ marginTop: isMobile ? 20 : 30, marginBottom: isMobile ? 0 : 50, padding: 15 }} className={classes.mobile}>
                <Grid item xs={12} md={6}>
                    {selectedButton === 0 ? (
                        <StakingDash />
                    ) : (
                        <StakingLeft vesting={selectedButton} /> // TODO - ADD CALLBACK
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.paperA}>
                        <div className={classes.rewards}>Wallet Balance</div>
                        <Box style={{ minWidth: 270, height: '100px', display: 'flex', flexDirection: 'row', marginTop: 90, justifyContent: 'center', alignItems: 'center' }}>
                            <IconButton onClick={() => setSelectedButton(0)}><TrendingUpIcon style={{ color: 'green' }} /></IconButton>
                            <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}>{context.trndBalance?.toLocaleString('en-US')}</Typography>
                            <img src="Android.png" style={{ height: 16, width: 16, marginTop: 0, marginRight: 5 }} alt="" />
                            <Typography className={classes.subtitleLil} style={{ color: 'grey' }} variant="body2">| 1400 $
                            </Typography>
                        </Box>
                        <Typography variant="body1" className={classes.desc}>
                            Deposit your TRND to earn more TRND. Deposit 1000 TRND to earn ETH
                        </Typography>
                        <Grid container style={{ marginTop: 80 }} spacing={3}>
                            <Grid item xs={6} md={6}>
                                <Box className={classes.boxGridInactive} style={{ width: '100%', height: '280px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', backgroundImage: 'url("58.png")', padding: 40 }}>
                                    <div>
                                        <Button
                                            className={classes.button}
                                            style={{
                                                backgroundImage: selectedButton === 1 ? "url('52.png')" : "url('53.png')", color: 'white', fontFamily: "Open Sans", border: selectedButton === 1 ? '1px solid rgba(6, 1, 26, 1)' : '', marginTop: 20
                                            }}
                                            onClick={() => handleClick(1)}
                                        >
                                            3M
                                        </Button>
                                    </div>
                                    <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>%APY </span>
                                        <span style={{ color: 'lightgrey' }}>2</span>
                                    </Typography>
                                    <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>NFT Slots</span>
                                        <span style={{ color: '#A4FE66' }}>1</span>
                                    </Typography>
                                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
                                        <Button size="medium" variant="contained" style={{ fontFamily: "Open Sans", color: selectedButton === 1 ? 'white' : '#8B3EFF', border: '1px solid #8B3EFF', background: selectedButton === 1 ? '#8B3EFF' : 'transparent' }} onClick={() => handleStakingModal(0)}>
                                            Deposit
                                        </Button>
                                        <Button size="medium" variant='text' style={{ fontFamily: "Open Sans", color: '#8B3EFF', border: '1px solid #8B3EFF' }} onClick={() => handleClick(1)}>
                                            View
                                        </Button>
                                    </div>
                                </Box>

                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Box className={classes.boxGridInactive} style={{ width: '100%', height: '280px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', backgroundImage: 'url("58.png")', padding: 40 }}>
                                    <div>
                                        <Button
                                            className={classes.button}
                                            style={{
                                                backgroundImage: selectedButton === 2 ? "url('52.png')" : "url('53.png')", color: 'white', fontFamily: "Open Sans", border: selectedButton === 2 ? '1px solid rgba(6, 1, 26, 1)' : '', marginTop: 20
                                            }}
                                            onClick={() => handleClick(2)}
                                        >
                                            6M
                                        </Button>
                                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>%APY </span>
                                            <span style={{ color: 'lightgrey' }}>4</span>
                                        </Typography>
                                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>NFT Slots</span>
                                            <span style={{ color: '#A4FE66' }}>2</span>
                                        </Typography>
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
                                            <Button size="medium" variant="contained" style={{ fontFamily: "Open Sans", color: selectedButton === 2 ? 'white' : '#8B3EFF', border: '1px solid #8B3EFF', background: selectedButton === 2 ? '#8B3EFF' : 'transparent' }} onClick={() => handleStakingModal(1)}>
                                                Deposit
                                            </Button>
                                            <Button size="medium" variant='text' style={{ fontFamily: "Open Sans", color: '#8B3EFF', border: '1px solid #8B3EFF' }} onClick={() => handleClick(2)}>
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Box className={classes.boxGridInactive} style={{ width: '100%', height: '280px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', backgroundImage: 'url("58.png")', padding: 40 }}>
                                    <div>
                                        <Button
                                            className={classes.button}
                                            style={{
                                                backgroundImage: selectedButton === 3 ? "url('52.png')" : "url('53.png')", color: 'white', fontFamily: "Open Sans", border: selectedButton === 3 ? '1px solid rgba(6, 1, 26, 1)' : '', marginTop: 20
                                            }}
                                            onClick={() => handleClick(3)}
                                        >
                                            12M
                                        </Button>
                                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>%APY </span>
                                            <span style={{ color: 'lightgrey' }}>8</span>
                                        </Typography>
                                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>NFT Slots</span>
                                            <span style={{ color: '#A4FE66' }}>5</span>
                                        </Typography>
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
                                            <Button size="medium" variant="contained" style={{ fontFamily: "Open Sans", color: selectedButton === 3 ? 'white' : '#8B3EFF', border: '1px solid #8B3EFF', background: selectedButton === 3 ? '#8B3EFF' : 'transparent' }} onClick={() => handleStakingModal(2)}>
                                                Deposit
                                            </Button>
                                            <Button size="medium" variant='text' style={{ fontFamily: "Open Sans", color: '#8B3EFF', border: '1px solid #8B3EFF' }} onClick={() => handleClick(3)}>
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Box className={classes.boxGridInactive} style={{ width: '100%', height: '280px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', backgroundImage: 'url("58.png")', padding: 40 }}>
                                    <div>
                                        <Button
                                            className={classes.button}
                                            style={{
                                                backgroundImage: selectedButton === 4 ? "url('52.png')" : "url('53.png')", color: 'white', fontFamily: "Open Sans", border: selectedButton === 4 ? '1px solid rgba(6, 1, 26, 1)' : '', marginTop: 20
                                            }}
                                            onClick={() => handleClick(4)}
                                        >
                                            24M
                                        </Button>
                                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>%APY </span>
                                            <span style={{ color: 'lightgrey' }}>20</span>
                                        </Typography>
                                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>NFT Slots</span>
                                            <span style={{ color: '#A4FE66' }}>10</span>
                                        </Typography>
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
                                            <Button size="medium" variant="contained" style={{ fontFamily: "Open Sans", color: selectedButton === 4 ? 'white' : '#8B3EFF', border: '1px solid #8B3EFF', background: selectedButton === 4 ? '#8B3EFF' : 'transparent' }} onClick={() => handleStakingModal(3)} >
                                                Deposit
                                            </Button>
                                            <Button size="medium" variant='text' style={{ fontFamily: "Open Sans", color: '#8B3EFF', border: '1px solid #8B3EFF' }} onClick={() => handleClick(4)}>
                                                View
                                            </Button>
                                        </div>
                                    </div>

                                </Box>
                            </Grid>
                        </Grid>
                        <div style={{ height: selectedButton > 0 ? 200 : 105 }} ></div>
                    </Paper>
                </Grid>

            </Grid>
        </div>
    );
};

export default Staking;
