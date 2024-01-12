/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useContext, useState } from 'react';
import { Grid, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Icon, useMediaQuery } from '@material-ui/core';
import { useStyleStaking } from '../useStyleStaking';
import { EtherContextRepository } from '../../../../ethers/EtherContextRepository';
import { EtherContext } from '../../../../ethers/EtherContext';
import EtherHelper from '../../../../ethers/EtherHelper';
import { ethers } from 'ethers';
import { IClaimETH } from '../../../../entities/IClaimETH';
import { useTokenAttributeCalculator } from './TokenAttributeCalculator';

const RevenueStats = () => {
    const classes = useStyleStaking();
    const [ethClaimed, setEthClaimed] = useState<any[]>([]);
    const { context, saveContext } = useContext(EtherContext) as EtherContextRepository;
    const [ethRev, setEthRev] = useState(0);
    const [nftEthRev, setNftEthRev] = useState(0)
    const { totalRevShare, totalApyBoost } = useTokenAttributeCalculator(context.nft_staked_data?.nft_staked_ids ?? [], context);
    const isMobile = useMediaQuery('(max-width:768px)');
    useEffect(() => {
        async function getEventEth() {
            const event = await EtherHelper.STAKING_EVENT_ETHCLAIMED(context);
            return event;
        }

        getEventEth().then((event: any[]) => {
            setEthClaimed(event);
            userRevShare()
        });

    }, [context]);

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

    return (
        <div style={{ width: '93%', margin: 10 }}>
            <Grid container spacing={5}>
                <Grid item xs={12} md={2}>
                    <Box
                        style={{
                            borderRadius: '5px',
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: isMobile ? 'row' : 'column',
                            justifyContent: 'center',
                            marginLeft: isMobile ? 0 : -20,
                            gap: isMobile ? 40 : 20
                        }}
                    >
                        <div style={{ alignItems: 'center', color: '#A4FE66', gap: 2 }}>
                            <Button
                                style={{
                                    backgroundImage: "url('52.png')",
                                    color: 'white',
                                    fontFamily: 'Open Sans',
                                    border: '2px solid #A4FE66',
                                    borderRadius: '50%',
                                    height: isMobile ? 70 : 125,
                                    width: isMobile ? 70 : 125,
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {ethRev.toFixed(0)}  <img src="74.png" alt="" style={{ width: 15, height: 15 }} />
                            </Button>
                            <p/>
                            ETH REV
                        </div>
                        <div style={{ alignItems: 'center', color: '#A4FE66', gap: 2 }}>
                            <Button
                                style={{
                                    backgroundImage: "url('52.png')",
                                    color: 'white',
                                    fontFamily: 'Open Sans',
                                    border: '2px solid #A4FE66',
                                    borderRadius: '50%',
                                    height: isMobile ? 70 : 125,
                                    width: isMobile ? 70 : 125,
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {totalRevShare.toFixed(1)} %
                            </Button>
                            <p/>
                            TOT SHARE
                        </div>
                        <div style={{ alignItems: 'center', color: '#A4FE66' }}>
                            <Button
                                style={{
                                    backgroundImage: "url('52.png')",
                                    color: 'white',
                                    fontFamily: 'Open Sans',
                                    border: '2px solid #A4FE66',
                                    borderRadius: '50%',
                                    height: isMobile ? 70 : 125,
                                    width: isMobile ? 70 : 125,
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {totalApyBoost.toFixed(1)} %
                            </Button>
                            <p/>
                            TOT APY
                        </div>
                    </Box>
                </Grid>
                <Grid key={2} item xs={12} md={8}>
                    <Box
                        style={{
                            width: isMobile ? '100%' : 'auto',
                            minHeight: isMobile ? '200px' : '600px',
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: 0,
                            justifyContent: 'center',
                            border: '2px solid #A4FE66',
                            borderRadius: '10px',
                            background: "url('54.png') no-repeat center",
                            color: '#FFFFFF',
                            backgroundPosition: 'center',
                            backgroundClip: 'padding-box',
                            maxHeight: isMobile ? '40%' : '80%',
                            overflowY: 'auto',
                            marginLeft: isMobile ? 0 : 10,
                            padding: 5,
                        }}
                    >
                        <TableContainer component={Paper}>
                            <Table aria-label="ethereum-event-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ background: "url('54.png') no-repeat center", color: '#A4FE66' }}>ADDRESS</TableCell>
                                        <TableCell style={{ background: "url('54.png') no-repeat center", color: '#A4FE66' }}>ETH CLAIMED</TableCell>
                                        <TableCell style={{ background: "url('54.png') no-repeat center", color: '#A4FE66' }}>BLOCK</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ethClaimed.map((event, index) => (
                                        <TableRow style={{ alignItems: 'center' }} key={index}>
                                            <TableCell style={{ background: "url('54.png') no-repeat center", color: '#A4FE66' }}>{event.args[0].slice(0, 5) + '...' + event.args[0].slice(37)}</TableCell>
                                            <TableCell style={{ background: "url('54.png') no-repeat center", color: '#A4FE66' }}>{ethers.utils.formatEther(event.args[1])} <img src="74.png" alt="" style={{ width: 15, height: 15 }} /></TableCell>
                                            <TableCell style={{ background: "url('54.png') no-repeat center", color: '#A4FE66' }}>{event.blockNumber}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid >
                <Grid key={3} item xs={12} md={2}>
                    <Box
                        style={{
                            borderRadius: '5px',
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: isMobile ? 0 : 0,
                            marginRight: isMobile ? 0 : 'auto',
                            marginLeft: 0
                        }}
                    >
                        <Button
                            style={{
                                backgroundImage: "url('52.png')",
                                color: 'white',
                                fontFamily: 'Open Sans',
                                border: '2px solid #A4FE66',
                                borderRadius: '50%',
                                height: isMobile ? 70 : 125,
                                width: isMobile ? 70 : 125,
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {nftEthRev.toFixed(1)}  <img src="74.png" alt="" style={{ width: 15, height: 15 }} />
                        </Button>
                        <p/>
                        <div style={{ alignItems: 'center', color: '#A4FE66', textAlign: 'center', width: '100%', marginLeft: isMobile ? 0 : 0 }}>
                        FACTORY ETH REV
                        </div>
                    </Box>
                </Grid>
            </Grid >
        </div >
    );
};

export default RevenueStats;

