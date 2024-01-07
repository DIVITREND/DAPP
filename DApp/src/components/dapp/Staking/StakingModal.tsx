import React, { ChangeEvent, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Slider, Typography, Button, styled } from '@material-ui/core';
import { BigNumber, ethers } from 'ethers';

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

interface StakingModalProps {
    open: boolean;
    onClose: () => void;
    maxRate: number;
    balance: number;
    vesting: number;
    stakeFunction: (amount: number) => void;
}

const StakingModal: React.FC<StakingModalProps> = ({ open, onClose, balance, vesting, stakeFunction, maxRate }) => {
    const classes = useStyles();
    const [selectedAmount, setSelectedAmount] = useState(0);

    const handleStake = () => {
        stakeFunction(selectedAmount); // daddy func
    };

    const handleSliderChange = (event: React.ChangeEvent<{}>, newValue: number | number[]) => {
        setSelectedAmount(newValue as number);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            className={classes.modal}
        >
            <div className={classes.paper}>
                <Typography variant="h6" className={classes.title}>
                    DEPOSIT
                </Typography>
                <Typography variant="subtitle1" style={{ marginBottom: '8px', color: 'white' }}>
                    Balance: {balance.toLocaleString("en-US")} $TRND
                </Typography>
                <Typography variant="subtitle1" style={{ marginBottom: '8px', color: 'white' }}>
                    Max Stakable: {maxRate.toLocaleString("en-US")} $TRND
                </Typography>
                <PrettoSlider
                    aria-label="pretto slider"
                    defaultValue={1}
                    value={selectedAmount}
                    min={1}
                    step={1}
                    max={maxRate}
                    onChange={(_: ChangeEvent<{}>, value: number | number[]) => setSelectedAmount(value as number)}
                />
                <Button
                    variant="contained"
                    className={classes.button}
                    onClick={handleStake}
                >
                    Stake {selectedAmount.toLocaleString("en-US")} TRND
                </Button>
            </div>
        </Modal>
    );
};

export default StakingModal;
