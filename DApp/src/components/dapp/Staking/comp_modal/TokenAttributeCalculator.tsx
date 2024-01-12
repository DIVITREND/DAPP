import React, { useState, useEffect, useCallback } from 'react';
import { IEtherContext } from '../../../../ethers/IEtherContext';
import EtherHelper from '../../../../ethers/EtherHelper';

interface TokenAttributes {
  Rev_Share: string;
  Apy_Boost: string;
}

interface TokenImages {
  [tokenId: number]: any;
}

interface Props {
  stakedTokens: number[];
  context: IEtherContext;
}

export const useTokenAttributeCalculator = (
  stakedTokens: number[],
  context: IEtherContext
): { totalRevShare: number; totalApyBoost: number } => {
  const [tokenImages, setTokenImages] = useState<TokenImages>({});

  const getURIsForStakedTokens = useCallback(async () => {
    const tokenImagesCopy = { ...tokenImages };

    for (const tokenId of stakedTokens) {
      try {
        if (!tokenImagesCopy[tokenId]) {
          const image = await EtherHelper.getTokenURI(context, tokenId);
          tokenImagesCopy[tokenId] = image;
        }
      } catch (error) {
        console.error('Error fetching image for token:', error);
      }
    }

    setTokenImages(tokenImagesCopy);
  }, [context, stakedTokens, tokenImages]);

  const getAttributesForToken = useCallback(
    (tokenId: number): TokenAttributes | undefined => {

      const Rev_Share = tokenImages[tokenId].attributes.find((attribute: any) => attribute.trait_type === 'Rev Share')?.value || ''
      const Apy_Boost = tokenImages[tokenId].attributes.find((attribute: any) => attribute.trait_type === 'APY boost')?.value || ''


      return {
        Rev_Share: Rev_Share,
        Apy_Boost: Apy_Boost,
      };

    },
    [tokenImages]
  );

  useEffect(() => {
    getURIsForStakedTokens();
  }, [getURIsForStakedTokens]);

  const sumAttributesForStakedTokens = (): { totalRevShare: number; totalApyBoost: number } => {
    const arrayRevShare: number[] = [];
    const arrayApyBoost: number[] = [];

    for (const tokenId of stakedTokens) {
      if (tokenImages[tokenId]) {
        const attributes = getAttributesForToken(tokenId);

        if (attributes) {
          arrayRevShare.push(parseFloat(attributes.Rev_Share));
          arrayApyBoost.push(parseFloat(attributes.Apy_Boost));
        }
      }
    }

    const formattedRevShare = arrayRevShare.reduce((acc, value) => acc + value, 0);
    const formattedApyBoost = arrayApyBoost.reduce((acc, value) => acc + value, 0);

    const totalRevShare =  Number(formattedRevShare.toFixed(2));
    const totalApyBoost =  Number(formattedApyBoost.toFixed(2));

    return { totalRevShare, totalApyBoost };
  };

  return sumAttributesForStakedTokens();
};

