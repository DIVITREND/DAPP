/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, Paper } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { IEtherContext } from '../../../../ethers/IEtherContext';
import EtherHelper from '../../../../ethers/EtherHelper';
import { GreenSwitch, useStyleStaking } from '../useStyleStaking';
import { EtherContextRepository } from '../../../../ethers/EtherContextRepository';
import { EtherContext } from '../../../../ethers/EtherContext';
import CardDetailsComponent from './NftCard';
import { Alert, AlertTitle, Collapse } from "@mui/material";
import LogoSpinnerAnimation from '../../../LogoSpinnerAnimation';
import { NftStake } from '../../../../entities/IStaking';
import { useTokenAttributeCalculator } from './TokenAttributeCalculator';


interface CombinedTokensIconsProps {
    tokenIdStaked: number[];
}

const getImages = async (context: IEtherContext, tokenIdStaked: number[]) => {
    return await Promise.all(tokenIdStaked.map(async (tokenId) => {
        const image = await EtherHelper.getTokenURI(context, tokenId);
        return image;
    }));
};

export const CombinedTokensIcons: React.FC<CombinedTokensIconsProps> = ({ tokenIdStaked }) => {
    const classes = useStyleStaking();
    const [images, setImages] = useState<string[]>([]);
    const [selectedVesting, setVesting] = useState<number>(0);
    const [selectedTokenCards, setSelectedTokenCards] = useState<number[]>([]);
    const [maxTokenIdStaked, setMaxTokenIdStaked] = useState<number>(0);
    const { context, saveContext } = useContext(EtherContext) as EtherContextRepository
    const [alertInfo, setAlertInfo] = useState<{ severity: "success" | "error", message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [alreadyStakedToFetch, setAlreadyStaked] = useState([] as number[])
    const [uriStaked, setUriStaked] = useState([] as { uri: string, id: number, attributes: [{ trait_type: string, value: string }] }[] | undefined)
    const [checked, setChecked] = useState(false);
    const [factoryIds, setTokenFactIds] = useState(context.FactoriesTokenIds)
    const handleChangeChecker = (event: ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    useEffect(() => {
        if (!context) return

        async function getAlreadyStaked() {
            const alreadyStaked = await EtherHelper.STAKING_NFT_DATA_NOCTX(selectedVesting, context) as NftStake
            return alreadyStaked
        }

        getAlreadyStaked().then(async (alreadyStaked: NftStake) => {
            const staked = alreadyStaked.nft_staked_ids ?? []
            console.log("staked", staked)
            const uri_staked = alreadyStaked.nft_staked_ids?.map(async (id: number) => {
                const uri = await EtherHelper.getTokenURI(context, id);
                return { uri, id };
            }) as { uri: { image: string, attributes: [{ trait_type: string, value: string }] }; id: number }[] | undefined;

            const promise_uri = await Promise.all(uri_staked ?? [])
            setAlreadyStaked(staked)
            setUriStaked(promise_uri.map((uri) => {
                return { uri: uri.uri.image, id: uri.id, attributes: uri.uri.attributes }
            }))
            setIsLoading(false)
        })

    }, [selectedVesting, context])

    const handleClickVesting = (vesting: number) => {
        setIsLoading(true)
        setVesting(vesting);
        setSelectedTokenCards([]);
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


    const [tokenImages, setTokenImages] = useState<{ [tokenId: number]: string }>({});

    const getImagesForToken = useCallback(async (tokenId: number) => {
        try {
            if (!tokenImages[tokenId]) {
                const image = await EtherHelper.getTokenURI(context, tokenId);
                setTokenImages((prevImages) => ({
                    ...prevImages,
                    [tokenId]: image,
                }));
            }
        } catch (error) {
            console.error('Error fetching image for token:', error);
        }
    }, [context, tokenImages]);

    const { totalRevShare, totalApyBoost } = useTokenAttributeCalculator(alreadyStakedToFetch, context);

    //console.log('totalRevShare, totalApyBoost', totalRevShare, totalApyBoost);

    useEffect(() => {
        tokenIdStaked.forEach((tokenId) => {
            getImagesForToken(tokenId);
        });
    }, [tokenIdStaked, getImagesForToken]);

    const [renderedTokens, setRenderedTokens] = useState<JSX.Element[]>([]);

    const handleCardClick = (index: number, tokenId: number) => {

        const isSelected = selectedTokenCards.includes(tokenId);
        let newSelectedTokenCards = [...selectedTokenCards];

        if (isSelected) {
            newSelectedTokenCards = newSelectedTokenCards.filter((selected) => selected !== tokenId);
        } else {
            if (newSelectedTokenCards.length < maxTokenIdStaked) {
                newSelectedTokenCards.push(tokenId);
            }
        }

        console.log("Updated selectedTokenCards:", newSelectedTokenCards);
        setSelectedTokenCards(newSelectedTokenCards);
    };


    const handleCardClickInComponent = useCallback((index: number, tokenId: number) => {
        handleCardClick(index, tokenId);
    }, [handleCardClick]);

    const tokensRow1 = renderedTokens.slice(0, 5);
    const tokensRow2 = renderedTokens.slice(5, 11);

    const vestingToMonths = [
        { vesting: 0, months: 3 },
        { vesting: 1, months: 6 },
        { vesting: 2, months: 12 },
        { vesting: 3, months: 24 }
    ]

    useEffect(() => {
        const fetchImages = async () => {
            const fetchedImages = await getImages(context, tokenIdStaked);
            setImages(fetchedImages);
        };

        fetchImages();
    }, [context, tokenIdStaked, maxTokenIdStaked]);

    useEffect(() => {
        const allTokenIds = [...alreadyStakedToFetch];
        const renderTokensAndAddTokens = () => {
            const numTokens = allTokenIds.length;
            const remainingSlots = maxTokenIdStaked - numTokens;
            const tokensPerRow = 5;
            let tokensCount = 0;

            const totalSelectedTokens = selectedTokenCards.length;

            const remainingSlotsAfterSelection = maxTokenIdStaked - numTokens - totalSelectedTokens;

            const tokensAndAddTokens = [];

            for (let i = 0; i < numTokens; i++) {
                const tokenId = allTokenIds[i];
                const image = tokenImages[tokenId];
                const uriInfo = uriStaked?.find((uri) => uri.id === tokenId);

                if (!selectedTokenCards.includes(tokenId)) {
                    const tokenElement = uriInfo ? (
                        <div onClick={() => handleUnstake(allTokenIds[i])} key={`token_${tokenId}`} style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                            <Box className={classes.gradientBox}>
                                <div className={classes.border}></div>
                                <img src={'https://ipfs.filebase.io/ipfs/' + uriInfo?.uri.slice(7)} alt={`Token ${tokenId}`} className={classes.image} />
                            </Box>
                            <div className={classes.content}>FACTORY #{tokenId}</div>
                            <div className={classes.content}>
                                REV {uriInfo?.attributes.find((attribute: any) => attribute.trait_type === 'Rev Share')?.value || ''} - APY {uriInfo?.attributes.find((attribute: any) => attribute.trait_type === 'APY boost')?.value || ''}
                            </div>
                        </div>

                    ) : (
                        < Box key={`token_${i}`} className={classes.gradientBox} >
                            <div className={classes.border}></div>
                            <img src={image} alt={`Token ${tokenId}`} className={classes.image} />
                            <div style={{ color: "#A4FE66", fontSize: 22 }}>
                                #{tokenId}
                            </div>
                        </Box >
                    );

                    tokensAndAddTokens.push(tokenElement);
                    tokensCount++;

                    if (tokensCount % tokensPerRow === 0) {
                        tokensAndAddTokens.push(<br key={`br_${i}`} />);
                    }
                } else {
                    console.log(`Token ${tokenId} is already selected and won't be displayed.`);
                }
            }

            // ... RemainingSlotsAfterSelection logic
            for (let i = 0; i < remainingSlotsAfterSelection; i++) {
                tokensAndAddTokens.push(
                    <Box key={`addToken_${i}`} className={classes.gradientBox}>
                        <div className={classes.border}></div>
                        <AddIcon
                            className={classes.image}
                            fontSize="large"
                            style={{ color: 'white', marginRight: 3 }}
                        />
                    </Box>
                );

                tokensCount++;

                if (tokensCount % tokensPerRow === 0) {
                    tokensAndAddTokens.push(<br key={`br_add_${i}`} />);
                }
            }

            // ... Code to display selected tokens
            for (let i = 0; i < totalSelectedTokens; i++) {
                const selectedTokenIndex = selectedTokenCards[i];
                const isSelectedTokenStaked = alreadyStakedToFetch.includes(selectedTokenIndex);

                if (!isSelectedTokenStaked) {
                    tokensAndAddTokens.push(
                        <Box key={`selectedToken_${i}`} className={classes.gradientBox}>
                            <Box key={`selectedToken_${i}`} className={classes.gradientBox}>
                                <div className={classes.border}></div>
                                <div style={{ color: "#A4FE66", fontSize: 22 }}>
                                    #{selectedTokenIndex}
                                </div>
                            </Box>
                        </Box>
                    );
                    tokensCount++;
                    if (tokensCount % tokensPerRow === 0) {
                        tokensAndAddTokens.push(<br key={`br_selected_${i}`} />);
                    }
                } else if (isSelectedTokenStaked) {
                    console.log(`Token ${selectedTokenIndex} is already staked and won't be displayed.`);
                }
            }
            setRenderedTokens(tokensAndAddTokens);
        };

        renderTokensAndAddTokens();
    }, [tokenIdStaked, maxTokenIdStaked, selectedTokenCards, images, selectedVesting, alreadyStakedToFetch, uriStaked]);



    const approveFactory = async () => {
        try {
            const ctx = await EtherHelper.FACTORIES_APPROVE(context, selectedTokenCards);
            saveContext(ctx)
        } catch (e) {
            console.log("Error approve factory: ", JSON.stringify(e))
        }
    }


    const StakeBooster = async () => {
        try {
            console.log("selectedTokenCards, selectedVesting: ", selectedTokenCards, selectedVesting)
            const ctx = await EtherHelper.STAKING_BOOST(selectedTokenCards, selectedVesting, context);
            console.log('StakeBooster', ctx);
            saveContext({ ...ctx, reload: true });
            setSelectedTokenCards([]);
        } catch (e) {
            console.error('Error staking booster:', JSON.stringify(e));
        }
    }

    const unStakeBooster = async (ids: number[]) => {
        try {
            console.log("selectedTokenCards, selectedVesting: ", selectedTokenCards, selectedVesting)
            const ctx = await EtherHelper.UNSTAKING_BOOST(ids, selectedVesting, context);
            console.log('StakeBooster', ctx);
            saveContext({ ...ctx, reload: true });
            setSelectedTokenCards([]);
            if (ctx.toastStatus) {
                setIsLoading(false)
            }
        } catch (e) {
            console.error('Error staking booster:', JSON.stringify(e));
        } finally {
            setIsLoading(false)
        }
    }

    const handleStake = async () => {
        setIsLoading(true)
        approveFactory().then(() => {
            StakeBooster().then(() => {
                setIsLoading(false)
                if (context.toastStatus === 'success') {
                    setAlertInfo({ severity: "success", message: context.toastDescription ?? '' })
                    setIsLoading(false)
                }
                if (context.toastStatus === 'error') {
                    setAlertInfo({ severity: "error", message: context.toastDescription ?? '' })
                    setIsLoading(false)
                }
            })
        })
    }

    const handleUnstake = async (ids: number) => {
        let arrayID: number[] = []
        arrayID[0] = ids
        setIsLoading(true)
        unStakeBooster(arrayID).then(() => {
            if (context.toastStatus === 'success') {
                setAlertInfo({ severity: "success", message: context.toastDescription ?? '' })
                setIsLoading(false)
            }
            if (context.toastStatus === 'error') {
                setAlertInfo({ severity: "error", message: context.toastDescription ?? '' })
                setIsLoading(false)
            }
        })
    }

    const handleUnstakeAll = async () => {
        setIsLoading(true)
        unStakeBooster(alreadyStakedToFetch).then(() => {
            if (context.toastStatus === 'success') {
                setAlertInfo({ severity: "success", message: context.toastDescription ?? '' })
                setIsLoading(false)
            }
            if (context.toastStatus === 'error') {
                setAlertInfo({ severity: "error", message: context.toastDescription ?? '' })
                setIsLoading(false)
            }
        })
    }

    const handleCloseAlert = () => {
        setAlertInfo(null)
    }

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
                <Collapse in={isLoading !== false}>
                    <Paper>
                        <LogoSpinnerAnimation loading={isLoading} />
                    </Paper>
                </Collapse>
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
                        background: "url('54.png') no-repeat center",
                        color: '#FFFFFF',
                        backgroundPosition: 'center',
                        backgroundClip: 'padding-box',
                        textAlign: "center",
                        border: '2px solid #8B3EFF',
                        padding: '20px',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        minHeight: '300px',
                        marginTop: -10
                    }}>
                        {isLoading ?
                            (
                                <>
                                </>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 50, marginBottom: 10, marginTop: -10 }}>
                                        <Button size="small" variant="outlined" style={{ color: '#A4FE66', borderColor: '#A4FE66', marginRight: 10 }} onClick={() => handleStake()}>STAKE {selectedTokenCards.length} NFT</Button>
                                        <Button size="small" variant="outlined" style={{ color: '#A4FE66', borderColor: '#A4FE66', marginLeft: 10 }} onClick={() => handleUnstakeAll()}>UNSTAKE ALL {alreadyStakedToFetch.length}</Button>
                                    </div>

                                    <div style={{ width: '100%', marginTop: 0, maxHeight: '100%', minHeight: 140 }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: '10px', alignItems: 'center', marginTop: 20 }}>
                                            {tokensRow1}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center', marginRight: 10, marginTop: 20 }}>
                                            {tokensRow2}
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <Box style={{
                        padding: '20px',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100%',
                        border: '2px solid #8B3EFF',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: 10,
                            marginTop: -10
                        }}>
                            <GreenSwitch checked={checked} onChange={handleChangeChecker} />
                        </div>
                        {checked === false ? (
                            <div style={{ minHeight: 200, maxHeight: 200, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Grid container spacing={10}>
                                    <Grid item xs={6} sm={4} md={4}>
                                        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                            <Box className={classes.gradientBox}>
                                                <div className={classes.border}></div>
                                                <div style={{ color: "#A4FE66", fontSize: 22 }}>
                                                    {totalRevShare}%
                                                </div>
                                            </Box>
                                            <div style={{ color: "#A4FE66", fontSize: 16, textAlign: 'center', marginTop: 20, maxWidth: '100%', whiteSpace: 'nowrap' }}>TOTAL REVENUE</div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={4}>
                                        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                            <Box className={classes.gradientBox}>
                                                <div className={classes.border}></div>
                                                <div style={{ color: "#A4FE66", fontSize: 22 }}>
                                                    {totalApyBoost}%
                                                </div>
                                            </Box>
                                            <div style={{ color: "#A4FE66", fontSize: 16, textAlign: 'center', marginTop: 20, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>TOTAL BOOST</div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4}>
                                        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                            <Box className={classes.gradientBox}>
                                                <div className={classes.border}></div>
                                                <div style={{ color: "#A4FE66", fontSize: 22 }}>
                                                    {alreadyStakedToFetch.length}
                                                </div>
                                            </Box>
                                            <div style={{ color: "#A4FE66", fontSize: 16, textAlign: 'center', marginTop: 20, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>TOTAL STAKED</div>
                                        </div>
                                    </Grid>
                                </Grid>

                            </div>

                        ) : (
                            <div>
                                {isLoading ? (<></>) : (
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 20, minHeight: 180, maxHeight: 180, overflowY: "auto"}}>
                                        {
                                            factoryIds &&
                                            factoryIds.map((tokenId, index) => {
                                                const isSelected = selectedTokenCards.includes(index);

                                                return (
                                                    <CardDetailsComponent
                                                        key={tokenId}
                                                        context={context}
                                                        tokenId={tokenId}
                                                        index={index}
                                                        selectedTokenCards={selectedTokenCards}
                                                        handleCardClick={handleCardClickInComponent}
                                                        isSelected={isSelected}
                                                    />
                                                );
                                            })
                                        }
                                    </div>
                                )}
                            </div>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </div >
    );
};