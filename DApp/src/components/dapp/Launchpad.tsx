/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@mui/material/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography, useMediaQuery, LinearProgress, Tooltip, Collapse, IconButton } from "@material-ui/core";
import { EtherContext } from "../../ethers/EtherContext";
import { EtherContextRepository } from "../../ethers/EtherContextRepository";
import { Alert, AlertTitle, Slider } from "@mui/material";
import { styled } from '@mui/material/styles';
import EtherHelper from "../../ethers/EtherHelper";
import LogoSpinnerAnimation from "../LogoSpinnerAnimation";
import InfoIcon from '@mui/icons-material/Info';
import CardDetailsComponent from "./Staking/comp_modal/NftCard";
import { ethers } from "ethers";

const drawerWidth = 240;

const PrettoSlider = styled(Slider)({
    color: '#A4FE66',
    height: 8,
    width: '70%',
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 30,
        width: 30,
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
        fontSize: 12,
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
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "auto",
        background: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(11,2,48,1) 35%)',
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
    greenBar: {
        backgroundColor: 'green',
        '& .MuiLinearProgress-bar': {
            backgroundColor: '#A4FE66',
        },
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
    paperA: {
        minHeight: '100%',
        background: 'rgba(0,0,0 ,0)',
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
        backgroundImage: "url('Android.png')",
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
            top: -15,
            left: -15,
            backgroundImage: "url('Android.png')",
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
    title: {
        position: "absolute",
        top: "3%",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        color: "white",
        textShadow: "3px 3px 2px rgba(139, 62, 255, 0.5)",

        fontSize: "24px",
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

        fontSize: "24px",
        "@media screen and (max-width: 768px)": {
            width: '100%',
        },
    },
    desc: {
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        textShadow: "0px 3px 2px rgba(139, 62, 255, 0.5)",

        fontSize: "18px",
        "@media screen and (max-width: 768px)": {
            width: '100%',
        },
    },
    claimable: {
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 146%',
        backgroundPosition: 'center',
        padding: theme.spacing(2),
        //border: "2px solid #8500FF",
        //borderBottom: 'none',
        //borderTop: 'none',
        textAlign: "center",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        "@media screen and (max-width: 768px)": {
            minHeight: 100,
        },
        overflow: 'hidden',
    },
    mint_s: {
        color: "white",
        background: "url('54.png') no-repeat center",
        backgroundOrigin: 'border-box',
        backgroundPosition: 'center',
        padding: theme.spacing(2),
        border: "2px solid #8A00F6",
        textAlign: "center",
        height: '100px',
        width: '70%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        "@media screen and (max-width: 768px)": {
            minHeight: 100,
        },
        overflow: 'hidden',
    },
    myTDF: {
        color: "white",
        background: 'rgba(17, 17, 17, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '2px solid transparent',
        borderRight: 'none',
        borderLeft: 'none',
        borderImage: 'linear-gradient(90deg, #52af77 30%, #8B3EFF 90%) 1',
        borderRadiusTopRight: 100,
        borderRadiusTopLeft: 100,
        padding: theme.spacing(2),
        textAlign: "center",
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        minHeight: '70vh',
        maxHeight: '70vh',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        gap: 20,
        scrollbarColor: '#8B3EFF transparent',  // added scroll bar (Chrome, Edge)
        "@media screen and (max-width: 768px)": {
            minHeight: '100%',
        },
    },
    subtitle: {
        color: "white",
        fontSize: "18px",
        textShadow: "0px 3px 2px rgba(139, 62, 255, 0.5)",

    },
    subtitleLil: {
        color: "white",
        fontSize: "16px",

    },
    subtitleLeft: {
        color: "white",
        fontSize: "26px",

    },
    subtitleLil2: {
        color: "white",
        fontSize: "14px",

    },
    icon: {
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        color: "#8B3EFF",
        "@media screen and (max-width: 768px)": {
            top: "30px",
            left: "10%",
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
    mobile: {
        marginTop: 0,
        "@media screen and (max-width: 768px)": {
            marginTop: 100,
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        background: 'black',
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    },
    image: {
        maxWidth: '80%',
        maxHeight: '80%',
        borderRadius: '50%',
        border: '2px solid transparent',
    },
    border: {
        position: 'absolute',
        width: 'calc(80px - 4px)',
        height: 'calc(80px - 4px)',
        border: '2px solid #A4FE66',
        borderRadius: '50%',
    },
    button: {
        width: '80px',
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
    },
    imageFactory: {
        width: '100%',
        height: 'auto',
        border: '2px solid transparent',
        borderRadius: 20,
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

const Launchpad = () => {
    const classes = useStyles();
    const isMobile = useMediaQuery("(max-width:960px)");
    const { context, saveContext } = React.useContext(EtherContext) as EtherContextRepository;
    const [loading, setIsLoading] = useState(false);
    const [comp, setComp] = useState(1); // Percentuale iniziale sulla slider
    const [weiToPay, setWeiToPay] = useState(0)
    const [alreadyMinted, setAlreadyMinted] = useState(0)
    const [alertInfo, setAlertInfo] = useState<{ severity: "success" | "error", message: string } | null>(null);
    const r_topay = weiToPay
    const toShow_toPay = comp * weiToPay
    const [factoryIds, setTokenFactIds] = useState(context.FactoriesTokenIds)

    const handleCloseAlert = () => {
        setAlertInfo(null);
    };

    async function getTotalCost() {
        try {
            const toPay = await EtherHelper.FACTORIES_CALC_COST(context, comp)
            return toPay
        } catch (e) {
            console.log("Error on Launchpad:getTotalCost: ", e)
            return
        }
    }

    async function payNFTs(amount: number) {
        setIsLoading(true)
        const topay = await getTotalCost()
        console.log("topay", topay)
        if (topay) {
            try {
                const ctx = await EtherHelper.FACTORIES_PAYNFT(context, ethers.utils.parseEther(topay.toString()), amount)
                saveContext(ctx)
                if (ctx.toastStatus === 'success') {
                    setAlertInfo({ severity: 'success', message: ctx.toastDescription ?? '' });
                } else {
                    setAlertInfo({ severity: 'error', message: ctx.toastDescription ?? '' });
                }
                setIsLoading(false)
            } catch (e: any) {
                console.log("Error on PayNFTs:undef: ", e)
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        async function getDataPayable() {
            const TCost = await getTotalCost();
            if (TCost) {
                setWeiToPay(Number(TCost))
            }
        }

        getDataPayable()
    }, [comp])

    function handleNull() {
        return
    }

    useEffect(() => {
        async function getSignerInfo() {
            await EtherHelper.querySignerInfo(context)
        }

        getSignerInfo().then(() => {
            const filteredTokenIds = context.FactoriesTokenIds?.filter((tokenId) => tokenId !== 0);
            setTokenFactIds(filteredTokenIds);
        });
    }, [context, context.FactoriesTokenIds, context.toastStatus]);

    async function claimNFTs() {
        try {
            const ctx = await EtherHelper.FACTORIES_CLAIM(context)
            saveContext(ctx)
            if (ctx.toastStatus === 'success') {
                setAlertInfo({ severity: 'success', message: ctx.toastDescription ?? '' });
            } else {
                setAlertInfo({ severity: 'error', message: ctx.toastDescription ?? '' });
            }
            setIsLoading(false)
        } catch (e: any) {
            console.log("Error on ClaimNFTs:undef: ", e)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        async function getActualSupply() {
            await EtherHelper.FACTORIES_ALREADY_MINTED(context)
                .then((m) => setAlreadyMinted(m ?? 0))
                .catch((e: any) => console.log(e))
        }

        getActualSupply()
    }, [context])

    const isConnected = context.connected ?? false;

    return (
        <div className={classes.root}>
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
            <Container maxWidth="xl" style={{ marginTop: isMobile ? 20 : -10, marginBottom: isMobile ? 100 : 0 }}>
                <Grid container spacing={2} style={{ marginTop: isMobile ? 10 : 0 }} className={classes.mobile}>
                    <Grid item xs={12} md={6}>

                        <Paper className={classes.paperA} style={{ marginTop: isMobile ? '400px' : '0px' }} >
                            <div className={classes.vestingOverlay}>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div className={classes.title}>LIVE </div>
                            </div>
                            <div className={classes.claimable} style={{ width: isMobile ? 300 : '280px', height: isMobile ? 300 : '280px', marginTop: isMobile ? -20 : 'auto' }}>
                                <img
                                    src="NFT1.jpeg"
                                    alt=""
                                    className={classes.imageFactory}
                                />
                            </div>
                            <Grid container style={{ marginTop: 320, padding: 20, justifyContent: 'center' }} spacing={1}>

                                <Grid item xs={12} md={12} style={{ marginBottom: 10 }}>
                                    <div style={{ display: "flex", flexDirection: 'row', marginTop: 0 }}>
                                        <LinearProgress style={{ marginTop: 10, display: "flex", width: '100%', flexDirection: 'row' }} className={classes.greenBar} color="secondary" variant="determinate" value={(alreadyMinted / 299) * 100} /> <Typography style={{ marginLeft: 10 }} className={classes.subtitleLil}>{((alreadyMinted / 299) * 100).toFixed(2)}%</Typography>
                                    </div>
                                </Grid>

                                <div>
                                    <Box style={{ minWidth: '100%', height: '100%', display: 'flex', flexDirection: 'row', marginTop: 0, justifyContent: 'center' }}>
                                        <Typography variant="body1" className={classes.subtitleLeft} style={{ marginRight: 5 }}>{alreadyMinted}
                                        </Typography>
                                        <Typography className={classes.subtitleLeft} style={{ color: 'grey' }} variant="body2">/ 299
                                        </Typography>
                                    </Box>
                                </div>
                                <Grid item md={12} xs={12} style={{ marginTop: 10, justifyContent: 'center', display: 'flex', marginBottom: 20 }} >
                                    <PrettoSlider
                                        aria-label="pretto slider"
                                        defaultValue={1}
                                        valueLabelDisplay="auto"
                                        value={comp}
                                        min={1}
                                        step={1}
                                        max={10}
                                        onChange={(_, value) => setComp(value as number)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Paper className={classes.mint_s} style={{ justifyContent: 'center' }}>
                                        <Box style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: 0, padding: 1, width: '80%', justifyContent: 'center' }}>
                                            <Box style={{ maxWidth: 270, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                                <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}>{comp}
                                                </Typography>
                                                <Typography className={classes.subtitleLil2} style={{ color: 'grey' }} variant="body2">| {toShow_toPay} ETH
                                                </Typography>
                                            </Box>
                                            <Button onClick={() => payNFTs(comp)} size="small" variant='outlined' className={classes.pulsButton} style={{ color: '#8B3EFF', border: '1px solid #8B3EFF', marginTop: 10 }}>
                                                MINT
                                            </Button>
                                        </Box>
                                        {/*Progressive bar*/}

                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Paper className={classes.mint_s}>
                                        <Box style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: 0, padding: 1, width: '80%', justifyContent: 'center' }}>
                                            <Box style={{ maxWidth: 270, display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: -12 }}>
                                                <Tooltip title="Claim your pending Factories now! If you've already MINTED a Factory, don't forget to claim it as well">
                                                    <IconButton>
                                                        <InfoIcon style={{ color: '#8B3EFF' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            <Button onClick={() => claimNFTs()} size="small" variant='outlined' className={classes.pulsButton} style={{ color: '#8B3EFF', border: '1px solid #8B3EFF', marginTop: 0, width: '100%' }}>
                                                CLAIM
                                            </Button>
                                        </Box>
                                        {/*Progressive bar*/}

                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* QUI */}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper className={classes.paperA}>
                            <Grid container spacing={2} style={{ marginTop: 0, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                <Grid item xs={12} md={12}>
                                    <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 0 }}>MY TDF: ({context.FactoriesTokenIds?.length})</Typography>
                                    <Paper className={classes.myTDF}>
                                        <Box style={{ marginTop: 20, marginBottom: 20 }}>
                                            <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {
                                                    factoryIds &&
                                                    factoryIds.map((tokenId, index) => (
                                                        <Grid key={tokenId} item xs={12} sm={6} md={4}>
                                                            <CardDetailsComponent
                                                                context={context}
                                                                tokenId={tokenId}
                                                                index={index}
                                                                selectedTokenCards={[]}
                                                                handleCardClick={handleNull}
                                                                isSelected={false}
                                                            />
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div >
    );
};

export default Launchpad;
