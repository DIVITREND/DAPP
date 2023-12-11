import React, { useState } from 'react';
import {
    Avatar,
    Button,
    Modal,
    Paper,
    Grid,
    Typography,
} from '@material-ui/core';

const ChainSelector: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Avatar
                variant="rounded"
                style={{
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                }}
                onClick={handleOpen}
            >
                <img
                    src={'cryptocom.png'}
                    alt="Crypto.com Chain"
                    style={{ width: '48px', height: '48px' }}
                />
            </Avatar>
            <Modal open={isOpen} onClose={handleClose}>
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">Select chain (coming soon)</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleClose}
                                    disabled
                                    startIcon={
                                        <img
                                            src={'avalanche-avax-logo.png'}
                                            alt="Avalanche"
                                            style={{ width: '30px' }}
                                        />
                                    }
                                >
                                    AVALANCHE
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleClose}
                                    disabled
                                    startIcon={
                                        <img
                                            src={'bnb-bnb-logo.png'}
                                            alt="BNB"
                                            style={{ width: '30px' }}
                                        />
                                    }
                                >
                                    BNB
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleClose}
                                    startIcon={
                                        <img
                                            src={'crypto-com-coin-cro-logo.png'}
                                            alt="Crypto.com Chain"
                                            style={{ width: '30px' }}
                                        />
                                    }
                                >
                                    CRONOS
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleClose}
                                    disabled
                                    startIcon={
                                        <img
                                            src={'ethereum-eth-logo.png'}
                                            alt="Ethereum"
                                            style={{ width: '30px' }}
                                        />
                                    }
                                >
                                    ETHEREUM
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleClose}
                                    disabled
                                    startIcon={
                                        <img
                                            src={'fantom-ftm-logo.png'}
                                            alt="Fantom"
                                            style={{ width: '30px' }}
                                        />
                                    }
                                >
                                    FANTOM
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleClose}
                                    disabled
                                    startIcon={
                                        <img
                                            src={'polygon-matic-logo.png'}
                                            alt="Polygon"
                                            style={{ width: '30px' }}
                                        />
                                    }
                                >
                                    POLYGON
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            </Modal>
        </>
    );
};

export default ChainSelector;