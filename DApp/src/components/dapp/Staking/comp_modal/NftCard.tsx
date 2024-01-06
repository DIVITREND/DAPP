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
    const [selected, setSelected] = useState(isSelected);
    const [images, setImages] = useState('');
    useEffect(() => {
        const fetchCardDetails = async () => {
            try {
                const fetchedMetadata = await EtherHelper.getTokenURI(context, tokenId);
                const isSelected = selectedTokenCards.includes(index);
                setMetadata(fetchedMetadata);
                setSelected(isSelected);
                setImages(fetchedMetadata.image.split(' '));
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
                        width: 100,
                        position: 'relative',
                        border: '2px solid #A4FE66',
                    }}
                >
                    <CardMedia
                        style={{ height: 100, objectFit: 'cover' }}
                        image={images && images.length > 0 ? 'https://ipfs.filebase.io/ipfs/' + (images[0] && images[0].slice(7)) : ''}
                        title={metadata ? metadata.edition : ''}
                    />
                </Card>
            </ButtonBase>
            <Typography variant="body1" style={{ color: '#A4FE66' }}>
                FACTORY #{metadata.edition}
            </Typography>
            <Typography variant="body2" style={{ color: '#A4FE66' }}>
                Rev Share: {metadata.attributes.find((attribute: any) => attribute.trait_type === 'Rev Share')?.value || ''}
            </Typography>
            <Typography variant="body2" style={{ color: '#A4FE66' }}>
                APY boost: {metadata.attributes.find((attribute: any) => attribute.trait_type === 'APY boost')?.value || ''}
            </Typography>
        </div>
    );
};

export default CardDetailsComponent;
