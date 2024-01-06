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
        <div style={{ width: '93%', margin: 10 }}>
            <Grid container spacing={5}>
                <Grid item xs={12} md={12}>
                    <Box
                        style={{
                            borderRadius: '5px',
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: isMobile ? 'row' : 'row',
                            justifyContent: 'center',
                            marginLeft: isMobile ? 0 : 0,
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
                                    height: isMobile ? 90 : 150,
                                    width: isMobile ? 90 : 150,
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {context.tot_trnd_staked ? Number(context.tot_trnd_staked?.toFixed(0)).toLocaleString('en-US') : 0}  <img src="78.png" alt="" style={{ width: 15, height: 15 }} />
                            </Button>
                            <p />
                            $TRND STAKED
                        </div>
                        <div style={{ alignItems: 'center', color: '#A4FE66', gap: 2 }}>
                            <Button
                                style={{
                                    backgroundImage: "url('52.png')",
                                    color: 'white',
                                    fontFamily: 'Open Sans',
                                    border: '2px solid #A4FE66',
                                    borderRadius: '50%',
                                    height: isMobile ? 90 : 150,
                                    width: isMobile ? 90 : 150,
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {context.nft_staked}
                            </Button>
                            <p />
                            FACT STAKED
                        </div>
                    </Box>
                </Grid>
                <Grid key={3} item xs={12} md={12}>
                    <Box
                        style={{
                            borderRadius: '5px',
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: isMobile ? 0 : 20,
                            marginRight: isMobile ? 0 : 'auto',
                            marginLeft: 0
                        }}
                    >
                        <div style={{ alignItems: 'center', color: '#A4FE66' }}>
                            <Button
                                style={{
                                    backgroundImage: "url('52.png')",
                                    color: 'white',
                                    fontFamily: 'Open Sans',
                                    border: '2px solid #A4FE66',
                                    borderRadius: '50%',
                                    height: isMobile ? 90 : 150,
                                    width: isMobile ? 90 : 150,
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {ethetrnd.trnd_balance?.toLocaleString('en-US')}  <img src="74.png" alt="" style={{ width: 15, height: 15 }} />
                            </Button>
                            <p />
                            ETH DISTRIBUTED
                        </div>
                        <div style={{ alignItems: 'center', color: '#A4FE66' }}>
                            <Button
                                style={{
                                    backgroundImage: "url('52.png')",
                                    color: 'white',
                                    fontFamily: 'Open Sans',
                                    border: '2px solid #A4FE66',
                                    borderRadius: '50%',
                                    height: isMobile ? 90 : 150,
                                    width: isMobile ? 90 : 150,
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {ethetrnd.eth_balance?.toLocaleString('en-US')}  <img src="74.png" alt="" style={{ width: 15, height: 15 }} />
                            </Button>
                            <p />
                            ETH DEPOSITED
                        </div>
                    </Box>
                </Grid>
            </Grid >
        </div >
    );
};

export default GlobalStats;
