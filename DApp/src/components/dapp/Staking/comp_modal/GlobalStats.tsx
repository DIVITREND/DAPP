/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useContext, useState } from 'react';
import { Grid, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Icon, useMediaQuery, Typography } from '@material-ui/core';
import { useStyleStaking } from '../useStyleStaking';
import { EtherContextRepository } from '../../../../ethers/EtherContextRepository';
import { EtherContext } from '../../../../ethers/EtherContext';
import EtherHelper from '../../../../ethers/EtherHelper';
import { ethers } from 'ethers';
import { IClaimETH } from '../../../../entities/IClaimETH';
import { useTokenAttributeCalculator } from './TokenAttributeCalculator';

interface ICTBalance {
    trnd_balance: number;
    eth_balance: number;
}

const GlobalStats = () => {
    const classes = useStyleStaking();
    const [ethClaimed, setEthClaimed] = useState<any[]>([]);
    const { context, saveContext } = useContext(EtherContext) as EtherContextRepository;
    const [ethRev, setEthRev] = useState(0);
    const [nftEthRev, setNftEthRev] = useState(0)
    const isMobile = useMediaQuery('(max-width:768px)');
    const [ethetrnd, setEthetrnd] = useState({} as ICTBalance);

    useEffect(() => {
        async function getEthClaimed() {
            const ethClaimed = await EtherHelper.STAKING_ALL_TOKENS_BALANCE(context)
            return ethClaimed;
        }

        getEthClaimed().then((ethClaimed: ICTBalance) => {
            console.log('ethClaimed', ethClaimed)
            setEthetrnd({ trnd_balance: ethClaimed.trnd_balance, eth_balance: ethClaimed.eth_balance });
        })

    }, [context]);

    return (
        <div style={{ width: isMobile ? '100%' : '93%', margin: 10 }}>
            <Grid container spacing={5}>
                <Grid item xs={6} md={6}>
                    <Box
                        style={{
                            borderRadius: '5px', 
                            color: '#A4FE66',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 20,
                        }}
                    >
                        <Button
                            style={{
                                backgroundImage: "url('52.png')",
                                color: 'white',
                                fontFamily: 'Open Sans',
                                border: '2px solid #A4FE66',
                                borderRadius: '50%',
                                height: isMobile ? 90 : 150,
                                width: isMobile ? 90 : 150,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {context.tot_trnd_staked ? Number(context.tot_trnd_staked?.toFixed(0)).toLocaleString('en-US') : 0}  <img src="78.png" alt="" style={{ width: 15, height: 15 }} />
                        </Button>
                        <p>$TRND STAKED</p>
                    </Box>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Box
                        style={{
                            borderRadius: '5px', 
                            color: '#A4FE66',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 20,
                        }}
                    >
                        <Button
                            style={{
                                backgroundImage: "url('52.png')",
                                color: 'white',
                                fontFamily: 'Open Sans',
                                border: '2px solid #A4FE66',
                                borderRadius: '50%',
                                height: isMobile ? 90 : 150,
                                width: isMobile ? 90 : 150,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {context.nft_staked}
                        </Button>
                        <p>FACT STAKED</p>
                    </Box>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Box
                        style={{
                            borderRadius: '5px', 
                            color: '#A4FE66',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 20,
                        }}
                    >
                        <Button
                            style={{
                                backgroundImage: "url('52.png')",
                                color: 'white',
                                fontFamily: 'Open Sans',
                                border: '2px solid #A4FE66',
                                borderRadius: '50%',
                                height: isMobile ? 90 : 150,
                                width: isMobile ? 90 : 150,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {ethetrnd.trnd_balance?.toLocaleString('en-US')}  <img src="74.png" alt="" style={{ width: 15, height: 15 }} />
                        </Button>
                        <p>ETH DISTRIBUTED</p>
                    </Box>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Box
                        style={{
                            borderRadius: '5px', 
                            color: '#A4FE66',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 20,
                        }}
                    >
                        <Button
                            style={{
                                backgroundImage: "url('52.png')",
                                color: 'white',
                                fontFamily: 'Open Sans',
                                border: '2px solid #A4FE66',
                                borderRadius: '50%',
                                height: isMobile ? 90 : 150,
                                width: isMobile ? 90 : 150,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {ethetrnd.eth_balance?.toLocaleString('en-US')}  <img src="74.png" alt="" style={{ width: 15, height: 15 }} />
                        </Button>
                        <p>ETH DEPOSITED</p>
                    </Box>
                </Grid>
            </Grid >
        </div >
    );
};

export default GlobalStats;
