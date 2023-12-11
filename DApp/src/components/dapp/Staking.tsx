import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@mui/material/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@mui/material/Grid";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Chip from "@mui/material/Chip";
import { Box, Button, Divider, Icon, Typography, useMediaQuery } from "@material-ui/core";
import { EtherContext } from "../../ethers/EtherContext";
import { EtherContextRepository } from "../../ethers/EtherContextRepository";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import TimerIcon from '@mui/icons-material/Timer';
import AddIcon from '@mui/icons-material/Add';
import { Badge, Slider } from "@mui/material";
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const PrettoSlider = styled(Slider)({
    color: '#52af77',
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
    title: {
        position: "absolute",
        top: "3%",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        color: "white",
        textShadow: "3px 3px 2px rgba(139, 62, 255, 0.5)",
        fontFamily: "Lilita One",
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
        fontFamily: "Lilita One",
        fontSize: "24px",
        "@media screen and (max-width: 768px)": {
            width: '100%',
        },
    },
    rewardsVesting: {
        position: "relative",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        color: "white",
        textShadow: "3px 3px 2px rgba(139, 62, 255, 0.5)",
        fontFamily: "Lilita One",
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
        textShadow: "0px 3px 2px rgba(139, 62, 255, 0.5)",
        fontFamily: "Lilita One",
        fontSize: "18px",
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
        fontFamily: "Lilita One",
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
        fontFamily: "Lilita One",
    },
    subtitleLil: {
        color: "white",
        fontSize: "16px",
        fontFamily: "Lilita One",
    },
    subtitleLil2: {
        color: "white",
        fontSize: "14px",
        fontFamily: "Lilita One",
    },
    subtitleLil3: {
        color: "white",
        fontSize: "12px",
        fontFamily: "Lilita One",
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
    chip: {
        position: "absolute",
        top: "70%",
        left: "18%",
        transform: "translateX(-50%)",
        margin: theme.spacing(1),
        fontFamily: "Josefin Sans",
    },
    chip2: {
        position: "absolute",
        top: "70%",
        left: "48%",
        transform: "translateX(-50%)",
        margin: theme.spacing(1),
    },
    chip3: {
        position: "absolute",
        top: "70%",
        left: "78%",
        transform: "translateX(-50%)",
        margin: theme.spacing(1),
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
    menuButton: {
        position: "absolute",
        top: "20px",
        right: `-${drawerWidth}px`, // Slide out from the right
        transform: "translateX(50%)", // Center the icon horizontally
        fontSize: "52px",
        color: 'white',
    },

    drawerHeader: {
        marginTop: 100,
        background: 'black',
        color: 'white',
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // Add other styles as needed
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        background: 'black',
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: 'black',
    },

    drawerContent: {
        background: 'black',
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
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
    },
    scrollingText: {
        width: '100%',
        height: '50px',
        overflow: 'hidden',
        color: "white",
        fontSize: "16px",
        fontFamily: "Lilita One",
        whiteSpace: 'nowrap',
        animation: '$scroll 20s linear infinite',
        textAlign: 'center',
        lineHeight: '50px',
    },
    '@keyframes scroll': {
        '0%': {
            transform: 'translateX(100%)',
        },
        '100%': {
            transform: 'translateX(-100%)',
        },
    },
}));

const images = [
    'factory.png',
    'factory.png',
    'factory.png',
    'factory.png',
    '',
];


const Staking = () => {
    const classes = useStyles();
    const isMobile = useMediaQuery("(max-width:960px)");
    const [openDrawer, setOpenDrawer] = useState(false);
    const { context, saveContext } = React.useContext(EtherContext) as EtherContextRepository;
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [rewards, setRewards] = useState(680); // Numero totale di rewards
    const [comp, setComp] = useState(1); // Percentuale iniziale sulla slider
    const [compound, setCompound] = useState((rewards * comp) / 100);
    const [claim, setClaim] = useState(rewards - compound);

    useEffect(() => {
        setCompound((rewards * comp) / 100);
        setClaim(rewards - ((rewards * comp) / 100));
    }, [comp, rewards]);

    const handleClick = (buttonNumber: any) => {
        setSelectedButton(buttonNumber);
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(context.addressSigner ?? '');
        setIsSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setIsSnackbarOpen(false);
    };

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    const claimTRND = rewards - compound

    return (
        <div className={classes.root} style={{ height: isMobile ? '100%' : '96vh' }}>
            <div className={classes.overlay}></div>
            <Container maxWidth="xl">
                <Grid container spacing={2} style={{ marginTop: isMobile ? 20 : 0 }} className={classes.mobile}>
                    <Grid item xs={12} md={6}>

                        <Paper className={classes.paperA} >
                            <div className={classes.vestingOverlay}>
                                {!isMobile && (
                                    <div>
                                        <CurrencyExchangeIcon fontSize="large" className={classes.icon} />
                                        <div className={classes.rewardsVesting}>24M</div>
                                    </div>
                                )}
                                {isMobile && (
                                    <div className={classes.rewardsVesting} style={{fontSize: "16px"}}>24M</div>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div className={classes.title}>730D : 23H : 45M Left </div>
                                {!isMobile && (
                                <TimerIcon fontSize="large" className={classes.iconTimer} />
                                )}
                            </div>
                            {!isMobile && (
                                <Paper className={classes.claimable} style={{ top: isMobile ? '10%' : "15%" }}>
                                    {!isMobile && (
                                        <Box style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: 0, padding: 1 }}>
                                            <Typography variant="body1" className={classes.subtitle}>
                                                {isMobile ? 'Claimable rewards' : 'Rewards to claim'}
                                            </Typography>
                                            <Box style={{ minWidth: 270, height: '100%', display: 'flex', flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                                                <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}>{rewards}
                                                </Typography>
                                                <img src="Android.png" style={{ height: 16, width: 16, marginTop: 5, marginRight: 5 }} alt="" />
                                                <Typography className={classes.subtitleLil} style={{ color: 'grey' }} variant="body2">| 900 $
                                                </Typography>
                                            </Box>
                                            <Button size="small" variant='outlined' className={classes.pulsButton} style={{ fontFamily: "Lilita One", color: '#8B3EFF', border: '1px solid #8B3EFF', marginTop: 10 }}>
                                                Compound & Collect
                                            </Button>
                                        </Box>
                                    )}
                                    {/*Progressive bar*/}
                                    <div>
                                        <Box style={{ minWidth: 270, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                            <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}>Compound {comp}%
                                            </Typography>
                                            <Typography className={classes.subtitleLil2} style={{ color: 'grey' }} variant="body2">| Collect {100 - comp}%
                                            </Typography>
                                        </Box>
                                        <Box style={{ minWidth: 270, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                            <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}> {compound} TRND
                                            </Typography>
                                            <Typography className={classes.subtitleLil2} style={{ color: 'grey' }} variant="body2">| {claimTRND.toFixed(1)}  TRND
                                            </Typography>
                                        </Box>
                                        <Typography className={classes.subtitleLil3} style={{ color: 'grey', marginBottom: 10 }} variant="body2">675$ | 225$
                                        </Typography>
                                        <PrettoSlider
                                            aria-label="pretto slider"
                                            defaultValue={1}
                                            value={comp}
                                            min={1}
                                            step={1}
                                            max={100}
                                            onChange={(_, value) => setComp(value as number)}
                                        />
                                    </div>
                                </Paper>
                            )}
                            {isMobile && (
                                <div style={{ display: 'flex', flexDirection: 'column', top: '6%', position: 'absolute' }}>
                                    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: 0, padding: 1 }}>
                                        <Typography variant="body1" className={classes.subtitle}>
                                            {isMobile ? 'Claimable rewards' : 'Rewards to claim'}
                                        </Typography>
                                        <Box style={{ minWidth: 270, height: '100%', display: 'flex', flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                                            <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}>{rewards}
                                            </Typography>
                                            <img src="Android.png" style={{ height: 16, width: 16, marginTop: 5, marginRight: 5 }} alt="" />
                                            <Typography className={classes.subtitleLil} style={{ color: 'grey' }} variant="body2">| 900 $
                                            </Typography>
                                        </Box>
                                        <Button size="small" variant='outlined' className={classes.pulsButton} style={{ fontFamily: "Lilita One", color: '#8B3EFF', border: '1px solid #8B3EFF', marginTop: 10 }}>
                                            Compound & Collect
                                        </Button>
                                    </Box>
                                    <div>
                                        <Box style={{ minWidth: 270, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                            <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}>Compound {comp}%
                                            </Typography>
                                            <Typography className={classes.subtitleLil2} style={{ color: 'grey' }} variant="body2">| Collect {100 - comp}%
                                            </Typography>
                                        </Box>
                                        <Box style={{ minWidth: 270, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                            <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}> {compound} TRND
                                            </Typography>
                                            <Typography className={classes.subtitleLil2} style={{ color: 'grey' }} variant="body2">| {claimTRND.toFixed(1)}  TRND
                                            </Typography>
                                        </Box>
                                        <Typography className={classes.subtitleLil3} style={{ color: 'grey', marginBottom: 10 }} variant="body2">675$ | 225$
                                        </Typography>
                                        <PrettoSlider
                                            aria-label="pretto slider"
                                            defaultValue={1}
                                            value={comp}
                                            min={1}
                                            step={1}
                                            max={100}
                                            onChange={(_, value) => setComp(value as number)}
                                        />
                                    </div>
                                </div>
                            )}
                            <Grid container style={{ marginTop: 270, padding: 20 }} spacing={1}>
                                <Grid item xs={12} md={6}>
                                    <Box className={classes.boxGrid} style={{ width: '100%', height: '200px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center' }}>

                                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Factories Staked</span>
                                            <span style={{ color: 'lightgrey' }}>4</span>
                                        </Typography>
                                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>%APY Factories</span>
                                            <span style={{ color: '#A4FE66' }}>12</span>
                                        </Typography>
                                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>%APY Pool</span>
                                            <span style={{ color: 'lightgrey' }}>10</span>
                                        </Typography>
                                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>%APY Total</span>
                                            <span style={{ color: 'lightgrey' }}>22</span>
                                        </Typography>
                                    </Box>

                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className={classes.boxGrid} style={{ width: '100%', height: '200px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center' }}>
                                        <Typography className={classes.subtitle} variant="body1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: 0 }}>
                                            Staked
                                        </Typography>
                                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>$TRND</span>
                                            <span style={{ color: 'lightgrey' }}>25000</span>
                                        </Typography>
                                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Worth</span>
                                            <span style={{ color: '#A4FE66' }}>50,000$</span>
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className={classes.boxGrid} style={{ width: '100%', height: '200px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center' }}>
                                        <Typography className={classes.subtitle} variant="body1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: 0 }}>
                                            Penalty Rewards
                                        </Typography>
                                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>$TRND</span>
                                            <span style={{ color: 'lightgrey' }}>12</span>
                                        </Typography>
                                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Worth</span>
                                            <span style={{ color: '#A4FE66' }}>24$</span>
                                        </Typography>
                                        <Button size="small" variant='outlined' style={{ fontFamily: "Lilita One", color: '#8B3EFF', border: '1px solid #8B3EFF', marginTop: 10 }}>
                                            Collect
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className={classes.boxGrid} style={{ height: '200px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center' }}>
                                        <Typography className={classes.subtitle} variant="body1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: 0 }}>
                                            Rewards
                                        </Typography>
                                        <Typography className={classes.subtitleLil} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>ETH</span>
                                            <span style={{ color: 'lightgrey' }}>0.2</span>
                                        </Typography>
                                        <Typography variant="body1" className={classes.subtitleLil} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Worth</span>
                                            <span style={{ color: '#A4FE66' }}>300$</span>
                                        </Typography>
                                        <Button size="small" variant='outlined' style={{ fontFamily: "Lilita One", color: '#8B3EFF', border: '1px solid #8B3EFF', marginTop: 10 }}>
                                            Collect
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            {/* QUI */}
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', gap: 20, marginTop: 60 }}>
                                {images.map((image, index) => (
                                    <Box key={index} className={classes.gradientBox}>
                                        <div className={classes.border}></div>
                                        <img src={image} alt={``} className={classes.image} />
                                        {image === '' && (
                                            <AddIcon className={classes.image} fontSize="large" style={{ color: 'white', marginRight: 3 }} />
                                        )}
                                    </Box>
                                ))}
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper className={classes.paperA}>
                            <div className={classes.rewards}>Wallet Balance</div>
                            <Box style={{ minWidth: 270, height: '100px', display: 'flex', flexDirection: 'row', marginTop: 90, justifyContent: 'center' }}>
                                <Typography variant="body1" className={classes.subtitleLil} style={{ marginRight: 5 }}>700
                                </Typography>
                                <img src="Android.png" style={{ height: 16, width: 16, marginTop: 5, marginRight: 5 }} alt="" />
                                <Typography className={classes.subtitleLil} style={{ color: 'grey' }} variant="body2">| 1400 $
                                </Typography>
                            </Box>
                            <Typography variant="body1" className={classes.desc}>
                                Deposit your TRND to earn more TRND. Deposit 1000 TRND to earn ETH
                            </Typography>
                            <Grid container style={{ marginTop: 70 }} spacing={3}>
                                <Grid item xs={6} md={6}>
                                    <Box className={classes.boxGridInactive} style={{ width: '100%', height: '270px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', backgroundImage: 'url("58.png")' }}>
                                        <div>
                                            <Button
                                                className={classes.button}
                                                style={{
                                                    backgroundImage: selectedButton === 1 ? "url('52.png')" : "url('53.png')", color: 'white', fontFamily: "Lilita One", border: selectedButton === 1 ? '1px solid rgba(6, 1, 26, 1)' : '', borderRight: 'none', borderTop: 'none'
                                                }}
                                                onClick={() => handleClick(1)}
                                            >
                                                1M
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
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
                                            <Button size="medium" variant="contained" style={{ fontFamily: "Lilita One", color: selectedButton === 1 ? 'white' : '#8B3EFF', border: '1px solid #8B3EFF', background: selectedButton === 1 ? '#8B3EFF' : 'transparent' }}>
                                                Deposit
                                            </Button>
                                            <Button size="medium" variant='text' style={{ fontFamily: "Lilita One", color: '#8B3EFF', border: '1px solid #8B3EFF' }}>
                                                View
                                            </Button>
                                        </div>
                                    </Box>

                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Box className={classes.boxGridInactive} style={{ width: '100%', height: '270px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', backgroundImage: 'url("58.png")' }}>
                                        <div>
                                            <Button
                                                className={classes.button}
                                                style={{
                                                    backgroundImage: selectedButton === 2 ? "url('52.png')" : "url('53.png')", color: 'white', fontFamily: "Lilita One", border: selectedButton === 2 ? '1px solid rgba(6, 1, 26, 1)' : '', borderRight: 'none', borderTop: 'none'
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
                                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
                                                <Button size="medium" variant="contained" style={{ fontFamily: "Lilita One", color: selectedButton === 2 ? 'white' : '#8B3EFF', border: '1px solid #8B3EFF', background: selectedButton === 2 ? '#8B3EFF' : 'transparent' }}>
                                                    Deposit
                                                </Button>
                                                <Button size="medium" variant='text' style={{ fontFamily: "Lilita One", color: '#8B3EFF', border: '1px solid #8B3EFF' }}>
                                                    View
                                                </Button>
                                            </div>
                                        </div>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Box className={classes.boxGridInactive} style={{ width: '100%', height: '270px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', backgroundImage: 'url("58.png")' }}>
                                        <div>
                                            <Button
                                                className={classes.button}
                                                style={{
                                                    backgroundImage: selectedButton === 3 ? "url('52.png')" : "url('53.png')", color: 'white', fontFamily: "Lilita One", border: selectedButton === 3 ? '1px solid rgba(6, 1, 26, 1)' : '', borderRight: 'none', borderTop: 'none'
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
                                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
                                                <Button size="medium" variant="contained" style={{ fontFamily: "Lilita One", color: selectedButton === 3 ? 'white' : '#8B3EFF', border: '1px solid #8B3EFF', background: selectedButton === 3 ? '#8B3EFF' : 'transparent' }}>
                                                    Deposit
                                                </Button>
                                                <Button size="medium" variant='text' style={{ fontFamily: "Lilita One", color: '#8B3EFF', border: '1px solid #8B3EFF' }}>
                                                    View
                                                </Button>
                                            </div>
                                        </div>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Box className={classes.boxGridInactive} style={{ width: '100%', height: '270px', display: 'flex', flexDirection: 'column', marginTop: 0, justifyContent: 'center', backgroundImage: 'url("58.png")' }}>
                                        <div>
                                            <Button
                                                className={classes.button}
                                                style={{
                                                    backgroundImage: selectedButton === 4 ? "url('52.png')" : "url('53.png')", color: 'white', fontFamily: "Lilita One", border: selectedButton === 4 ? '1px solid rgba(6, 1, 26, 1)' : '', borderRight: 'none', borderTop: 'none'
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
                                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
                                                <Button size="medium" variant="contained" style={{ fontFamily: "Lilita One", color: selectedButton === 4 ? 'white' : '#8B3EFF', border: '1px solid #8B3EFF', background: selectedButton === 4 ? '#8B3EFF' : 'transparent' }}>
                                                    Deposit
                                                </Button>
                                                <Button size="medium" variant='text' style={{ fontFamily: "Lilita One", color: '#8B3EFF', border: '1px solid #8B3EFF' }}>
                                                    View
                                                </Button>
                                            </div>
                                        </div>

                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    {/* MAIN */}
                </Grid>
            </Container>
        </div>
    );
};

export default Staking;
