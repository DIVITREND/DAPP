import React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: 950,
        background: "black",
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
    imageContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
    },
    image: {
        maxWidth: '300px',
        border: '5px solid #8500FF',
        borderRadius: '50%',
    },
    topRectangle: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '70vh',
        background: 'url(DiviBG.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundClip: 'padding-box',
        zIndex: 1,
        border: '5px solid black',
        borderRadius: 25
    },
    bottomRectangle: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '77vh',
        backgroundColor: 'black',
        zIndex: 0,
        border: '10px solid black',
        borderRadius: 25
    },
    text: {
        color: '#8500FF',
        fontSize: '44px',
        position: 'absolute',
        top: '62%',
        left: '0',
        width: '100%',
        zIndex: 2,
        textAlign: 'center',
        fontWeight: 'bold',
    },
}));

export const StakingDash = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.container} style={{ minHeight: '1020px' }}>
            <div className={classes.imageContainer}>
                <img src="Android.png" alt="Hero Image" className={classes.image} />
            </div>
            <div className={classes.topRectangle}></div>
            <div className={classes.bottomRectangle}></div>
            <div className={classes.text} >DIVITREND STAKING</div>
        </Paper>
    );
};
