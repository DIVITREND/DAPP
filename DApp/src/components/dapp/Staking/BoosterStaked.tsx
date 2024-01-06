import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { IEtherContext } from '../../../ethers/IEtherContext';
import EtherHelper from '../../../ethers/EtherHelper';
import { useStyleStaking } from './useStyleStaking';
import { makeStyles } from '@material-ui/core/styles';
import { NftStake } from '../../../entities/IStaking';



interface BoosterStakedProps {
    clickable: (n: number) => void;
    vesting: number;
    maxtokenIdsstaked: number;
    context: IEtherContext;
}

const getImages = async (context: IEtherContext, tokenIdStaked: number[]) => {
    const images = [];
    for (let i = 0; i < tokenIdStaked.length; i++) {
        const image = await EtherHelper.getTokenURI(context, tokenIdStaked[i]);
        images.push(image);
    }
    return images;
};

const BoosterStaked: React.FC<BoosterStakedProps> = ({ clickable, vesting, maxtokenIdsstaked, context }) => {
    const classes = useStyleStaking();
    const [images, setImages] = useState<string[]>([]);
    const [renderedTokens, setRenderedTokens] = useState<JSX.Element[]>([]);
    const maxTokenIdStaked = maxtokenIdsstaked;
    const [tokenImages, setTokenImages] = useState<{ [tokenId: number]: string }>({});
    const [uriStaked, setUriStaked] = useState([] as { uri: string, id: number, attributes: [{ trait_type: string, value: string }] }[] | undefined)
    const [alreadyStakedToFetch, setAlreadyStaked] = useState([] as number[])

    let selectedTokenCards: any[] = []

    useEffect(() => {
        const fetchImages = async () => {
            const fetchedImages = await getImages(context, alreadyStakedToFetch);
            setImages(fetchedImages);
        };

        fetchImages();
    }, [context, alreadyStakedToFetch]);

    useEffect(() => {
        if (!context) return

        async function getAlreadyStaked() {
            const alreadyStaked = await EtherHelper.STAKING_NFT_DATA_NOCTX(vesting - 1, context) as NftStake
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
            setUriStaked(promise_uri.map((uri) => {
                return { uri: uri.uri.image, id: uri.id, attributes: uri.uri.attributes }
            }))
        })

    }, [vesting, context])


    useEffect(() => {
        const allTokenIds = [...alreadyStakedToFetch];

        const renderTokensAndAddTokens = () => {
            const numTokens = allTokenIds.length;
            const remainingSlots = maxTokenIdStaked - numTokens;
            const tokensPerRow = 5;
            let tokensCount = 0;

            const tokensAndAddTokens = [];

            for (let i = 0; i < numTokens; i++) {
                const tokenId = allTokenIds[i];
                const image = tokenImages[tokenId];
                const uriInfo = uriStaked?.find((uri) => uri.id === tokenId);
                const tokenElement = uriInfo ? (
                    <div onClick={() => handleTokenClick(4)} key={`token_${i}`} style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <Box className={classes.gradientBox}>
                            <div className={classes.border}></div>
                            <img src={'https://ipfs.filebase.io/ipfs/' + uriInfo?.uri.slice(7)} alt={`Token ${tokenId}`} className={classes.image} />
                        </Box>
                        <div style={{ color: "#A4FE66", fontSize: 14, textAlign: 'center' }}>FACTORY #{tokenId}</div>
                        <div style={{ color: "#A4FE66", fontSize: 14, flexDirection: 'row', display: 'flex', justifyContent: 'center' }}>
                            REV {uriInfo?.attributes.find((attribute: any) => attribute.trait_type === 'Rev Share')?.value || ''} - APY {uriInfo?.attributes.find((attribute: any) => attribute.trait_type === 'APY boost')?.value || ''}
                        </div>
                    </div>

                ) : (
                    <Box onClick={() => handleTokenClick(4)} key={`token_${i}`} className={classes.gradientBox}>
                        <div className={classes.border}></div>
                        <img src={image} alt={`Token ${tokenId}`} className={classes.image} />
                        <div style={{ color: "#A4FE66", fontSize: 22 }}>
                            #{tokenId}
                        </div>
                    </Box>
                );

                tokensAndAddTokens.push(tokenElement);

                tokensCount++;

                if (tokensCount % tokensPerRow === 0) {
                    tokensAndAddTokens.push(<br key={`br_${i}`} />);
                }
            }

            const handleTokenClick = (tokenId: number) => {
                clickable(tokenId);
            };


            const totalSelectedTokens = selectedTokenCards.length;
            const remainingSlotsAfterSelection = maxTokenIdStaked - numTokens - totalSelectedTokens;

            for (let i = 0; i < remainingSlotsAfterSelection; i++) {
                tokensAndAddTokens.push(
                    <Box key={`addToken_${i}`} className={classes.gradientBox}>
                        <div className={classes.border}></div>
                        <AddIcon
                            className={classes.image}
                            fontSize="large"
                            style={{ color: 'white', marginRight: 3 }}
                            onClick={() => handleTokenClick(4)} 
                        />
                    </Box>
                );

                tokensCount++;

                if (tokensCount % tokensPerRow === 0) {
                    tokensAndAddTokens.push(<br key={`br_add_${i}`} />);
                }
            }

            for (let i = 0; i < selectedTokenCards.length; i++) {
                const selectedTokenIndex = selectedTokenCards[i];
                tokensAndAddTokens.push(
                    <Box onClick={() => handleTokenClick(3)} key={`selectedToken_${i}`} className={classes.gradientBox}>
                        <div className={classes.border}></div>
                        <div style={{ color: "#A4FE66", fontSize: 22 }}>
                            #{selectedTokenIndex}
                        </div>
                    </Box>
                );

                tokensCount++;

                if (tokensCount % tokensPerRow === 0) {
                    tokensAndAddTokens.push(<br key={`br_selected_${i}`} />);
                }
            }

            setRenderedTokens(tokensAndAddTokens);
        };

        renderTokensAndAddTokens();
    }, [alreadyStakedToFetch, maxTokenIdStaked, selectedTokenCards, images, classes, tokenImages]);

    const tokensRow1 = renderedTokens.slice(0, 5);
    const tokensRow2 = renderedTokens.slice(5, 11);

    return (
        <div style={{ width: '100%', marginTop: 0, maxHeight: 140, minHeight: 140 }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: '10px' }}>
                {tokensRow1}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 20, marginRight: 20, marginTop: 40, marginBottom: 20 }}>
                {tokensRow2}
            </div>
        </div>
    );
};

export default BoosterStaked;
