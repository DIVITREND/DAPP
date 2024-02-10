import { ButtonBase, Card, CardMedia, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import EtherHelper from '../../../../ethers/EtherHelper';

const CardDetailsComponent = ({ context, tokenId, index, selectedTokenCards, handleCardClick, isSelected }: { context: any, tokenId: any, index: any, selectedTokenCards: any[], handleCardClick: any, isSelected: any }) => {
    const [metadata, setMetadata] = useState({
        name: '',
        description: '',
        image: '',
        edition: '',
        attributes: [],
    } as any);
    const [images, setImages] = useState('');
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        const fetchCardDetails = async () => {
            try {
                const fetchedMetadata = await EtherHelper.getTokenURI(context, tokenId);
                setMetadata(fetchedMetadata);
                const i_mg = fetchedMetadata.image
                setImages(i_mg);
            } catch (error) {
                console.error('Error fetching card details:', error);
            }
        };

        fetchCardDetails();
    }, [context, tokenId, index, selectedTokenCards]);

    const onSelect = () => {
        if (!metadata || !('edition' in metadata) || !metadata.attributes) {
            return;
        }
        console.log('CardDetailsComponent', { context, tokenId, index, selectedTokenCards, onSelect, isSelected });
        handleCardClick(index, tokenId);
    };

    if (!metadata) {
        return null;
    }

    return (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <ButtonBase focusRipple onClick={onSelect}>
                <Card
                    style={{
                        marginBottom: 10,
                        width: isMobile ? 50 : 100,
                        position: 'relative',
                        border: '2px solid #A4FE66',
                    }}
                >
                    <CardMedia
                        style={{ height: isMobile ? 50 : 100, objectFit: 'cover' }}
                        image={images && images.length > 0 ? 'https://ipfs.filebase.io/ipfs/' + images.slice(7) : ''}
                        title={metadata ? metadata.edition : ''}
                    />
                </Card>
            </ButtonBase>
            <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 110}}>
                <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

                    <Typography variant={isMobile ? "body2" : "body2"} style={{ color: '#A4FE66' }}>
                        FACTORY #{metadata.edition}
                    </Typography>
                </div>

                <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Typography variant="body2" style={{ color: '#A4FE66' }}>
                        REV: {metadata.attributes.find((attribute: any) => attribute.trait_type === 'Rev Share')?.value || ''}
                    </Typography>
                </div>

                <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Typography variant="body2" style={{ color: '#A4FE66' }}>
                        APY: {metadata.attributes.find((attribute: any) => attribute.trait_type === 'APY boost')?.value || ''}
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default CardDetailsComponent;
