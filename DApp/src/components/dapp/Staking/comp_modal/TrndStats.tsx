/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, useMediaQuery } from '@material-ui/core';
import { IEtherContext } from '../../../../ethers/IEtherContext';
import EtherHelper from '../../../../ethers/EtherHelper';
import { useStyleStaking } from '../useStyleStaking';
import { EtherContextRepository } from '../../../../ethers/EtherContextRepository';
import { EtherContext } from '../../../../ethers/EtherContext';
import { useTokenAttributeCalculator } from './TokenAttributeCalculator';
import { NftStake } from '../../../../entities/IStaking';


interface TrndStatsProps {
    tokenIdStaked: number[];
}

export const TrndStats: React.FC<TrndStatsProps> = ({ tokenIdStaked }) => {
    const classes = useStyleStaking();
    const [selectedVesting, setVesting] = useState<number>(0);
    const [maxTokenIdStaked, setMaxTokenIdStaked] = useState<number>(0);
    const { context, saveContext } = useContext(EtherContext) as EtherContextRepository
    const [isLoading, setIsLoading] = useState(false)
    const [alreadyStakedToFetch, setAlreadyStaked] = useState([] as number[])
    const [factoryIds, setTokenFactIds] = useState(context.FactoriesTokenIds)
    const isMobile = useMediaQuery('(max-width:768px)');
    const [userDeposit, setUserDeposit] = useState('0');
    const [startTime, setStartTime] = useState(0);
    const [claimable, setClaimable] = useState(0);

    const stakingDataRew = async () => {
        try {
            const dataRew = await EtherHelper.STAKING_DATA_REW_TRND(selectedVesting, context)
            if (dataRew && dataRew.user_pending_time && dataRew.user_pending_trnd) {
                setStartTime(dataRew.user_pending_time.toNumber())
                setUserDeposit(dataRew.user_pending_trnd.toFixed(2))
            }
        } catch (e) {
            console.log("error on stakingDataRew: ", e)
        }
    }

    useEffect(() => {
        if (!context) return

        async function getAlreadyStaked() {
            const alreadyStaked = await EtherHelper.STAKING_NFT_DATA_NOCTX(selectedVesting, context) as NftStake
            return alreadyStaked
        }

        getAlreadyStaked().then(async (alreadyStaked: NftStake) => {
            const staked = alreadyStaked.nft_staked_ids ?? []
            const uri_staked = alreadyStaked.nft_staked_ids?.map(async (id: number) => {
                const uri = await EtherHelper.getTokenURI(context, id);
                return { uri, id };
            }) as { uri: { image: string, attributes: [{ trait_type: string, value: string }] }; id: number }[] | undefined;

            const promise_uri = await Promise.all(uri_staked ?? [])
            setAlreadyStaked(staked)
        })

    }, [selectedVesting, context])

    useEffect(() => {
        if (!context) return
        setUserDeposit('0')
        stakingDataRew()
    }, [selectedVesting])

    const handleClickVesting = (vesting: number) => {
        setIsLoading(true)
        setVesting(vesting);
    };

    useEffect(() => {
        function getMaxTokenIdStaked() {
            switch (selectedVesting) {
                case 0:
                    return 1;
                case 1:
                    return 2;
                case 2:
                    return 5;
                case 3:
                    return 10;
                default:
                    return 1;
            }
        }

        const maxTokenIdStaked = getMaxTokenIdStaked();
        setMaxTokenIdStaked(maxTokenIdStaked);
    }, [selectedVesting]);

    const { totalRevShare, totalApyBoost } = useTokenAttributeCalculator(alreadyStakedToFetch, context);

    const vestingToMonths = [
        { vesting: 0, months: 3 },
        { vesting: 1, months: 6 },
        { vesting: 2, months: 12 },
        { vesting: 3, months: 24 }
    ]
    //{Number(context.trnd_to_claim?.toFixed(2)).toLocaleString('en-US')} <img src="78.png" alt="" style={{ width: 15, height: 15 }} />

    useEffect(() => {
        const claimable = context.trnd_to_claim
        setClaimable(claimable ?? 0)
    }, [context, selectedVesting]);

    useEffect(() => {

        async function getSignerInfo() {
            await EtherHelper.querySignerInfo(context)
        }

        getSignerInfo().then(() => {
            setTokenFactIds(context.FactoriesTokenIds)
        })

    }, [context, context.FactoriesTokenIds, context.toastStatus]);

    return (
        <div style={{ width: '100%', marginBottom: 100 }}>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={12}>
                    <div style={{
                        color: '#FFFFFF',
                        backgroundPosition: 'center',
                        backgroundClip: 'padding-box',
                        textAlign: "center",
                        marginTop: '20px',
                        padding: '20px',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 20 }}>
                            {vestingToMonths.map((vesting, index) => {
                                return (
                                    <Button
                                        key={index}
                                        size="small"
                                        variant="outlined"
                                        style={{
                                            border: selectedVesting === vesting.vesting ? '1px solid #A4FE66' : '#8500FF',
                                            color: selectedVesting === vesting.vesting ? '#A4FE66' : '#8500FF',
                                        }}
                                        onClick={() => handleClickVesting(vesting.vesting)}
                                        className={classes.buttonMonths}
                                    >
                                        {vesting.months}
                                    </Button>
                                )
                            }
                            )}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <div style={{
                        color: '#FFFFFF',
                        textAlign: "center",
                        //border: '2px solid #8B3EFF',
                        padding: '20px',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        minHeight: '100px',
                        marginTop: -10,
                        gap: 10
                    }}>

                        <div style={{ display: 'flex', justifyContent: 'space-around', gap: 20, padding: 10 }}>
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
                                    {userDeposit ? Number(Number(userDeposit).toFixed(0)).toLocaleString('en-US') : 0}  <img src="78.png" alt="" style={{ width: 15, height: 15 }} />
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
                                    {
                                        Number(userDeposit) > 0 || alreadyStakedToFetch.length > 0 ? (
                                            <div>
                                                {Number(claimable.toFixed(2)).toLocaleString('en-US')}
                                                <img src="78.png" alt="" style={{ width: 15, height: 15 }} />
                                            </div>
                                        ) : (
                                            0
                                        )
                                    }
                                </Button>
                                <p />
                                $TRND CLAIMABLE
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
                                    {alreadyStakedToFetch.length}
                                </Button>
                                <p />
                                FACT STAKED
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <div style={{
                        color: '#FFFFFF',
                        textAlign: "center",
                        //border: '2px solid #8B3EFF',
                        padding: '20px',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        minHeight: '100px',
                        marginTop: -10,
                        gap: 10
                    }}>

                        <div style={{ display: 'flex', justifyContent: 'space-around', gap: 20, padding: 10 }}>
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
                                    {totalApyBoost.toFixed(1)}%
                                </Button>
                                <p />
                                APY BOOST
                            </div>
                            <div style={{ alignItems: 'center', color: '#A4FE66', gap: 2 }}>
                                <Button
                                    style={{
                                        backgroundImage: "url('52.png')",
                                        color: 'white',
                                        fontFamily: 'Open Sans',
                                        border: alreadyStakedToFetch.length > 0 || Number(userDeposit) > 0 ? '2px solid #A4FE66' : '2px solid red',
                                        borderRadius: '50%',
                                        height: isMobile ? 90 : 150,
                                        width: isMobile ? 90 : 150,
                                        justifyContent: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {alreadyStakedToFetch.length > 0 || Number(userDeposit) > 0 ? 'ON' : 'OFF'}
                                </Button>
                                <p />
                                ETH REV
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div >
    );
};