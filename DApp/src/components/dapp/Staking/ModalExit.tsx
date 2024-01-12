import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0, 0.7)',
    },
    paper: {
        background: 'linear-gradient(135deg, #000000, #0B0230)',
        border: '2px solid #8500FF',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        width: 600,
        "@media screen and (max-width: 768px)": {
            width: 400,
        },
    },
    title: {
        color: '#A4FE66',
        textAlign: 'center',
        marginBottom: theme.spacing(2),
    },
    slider: {
        width: '80%',
        margin: '0 auto',
    },
    button: {
        backgroundColor: '#8500FF',
        color: '#FFFFFF',
        marginTop: theme.spacing(2),
    },
}));

interface ModalExitProps {
    open: boolean;
    onClose: () => void;
    malusPerc: number;
    amountStaked: number;
    vesting: number;
    exitFunction: () => void;
}

const ModalExit: React.FC<ModalExitProps> = ({ open, onClose, malusPerc, vesting, exitFunction, amountStaked }) => {
    const classes = useStyles();

    const handleExit = () => {
        exitFunction(); // daddy func
    };

    const amountAfterMalus = amountStaked * (1 - malusPerc / 100);

    return (
        <Modal
            open={open}
            onClose={onClose}
            className={classes.modal}
        >
            <div className={classes.paper}>
                <Typography variant="h6" className={classes.title}>
                    EXIT STAKING - ({vesting}M)
                </Typography>
                <Typography variant="subtitle1" style={{ marginBottom: '8px', color: 'white' }}>
                    Staked: {amountStaked.toLocaleString("en-US")} $TRND
                </Typography>
                <Typography variant="subtitle1" style={{ marginBottom: '8px', color: 'white' }}>
                    Malus: {malusPerc.toFixed(2)}%
                </Typography>
                <Typography variant="subtitle1" style={{ marginBottom: '8px', color: 'white' }}>
                    You will get: {amountAfterMalus.toLocaleString("en-US")} $TRND
                </Typography>
                <Button className={classes.button} onClick={handleExit}>EXIT</Button>
            </div>
        </Modal>
    );
};

export default ModalExit;
