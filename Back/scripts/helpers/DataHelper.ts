import { ILegendsNFT, Metadata, Rarity, Trait, Value } from "./types";
import { RARITY } from "./types/RarityList";
import { METADATA } from "./types/MetadataList";

class DataHelper {
  private static legendsMap: { [id: number]: string } = {
    106: "420",
    1670: "Air",
    2188: "Angel",
    2226: "Death",
    36: "Earth",
    1378: "Elon",
    2843: "Fire",
    3000: "God",
    249: "Goku",
    698: "Hood Diamond",
    906: "Joker",
    1380: "Lightning",
    2457: "Rick",
    3116: "Robot",
    459: "Water",
    690: "Green Fire",
    800: "Blue Fire",
  };


  public static getRarity(type: string, trait: string, nft: Metadata): number {
    const rarityType = RARITY.find((rarity) => rarity.type === type);
    if (!rarityType) {
      return 0;
    }

    // Filtra gli attributi dell'NFT per il tipo specifico
    const traitsOfType = nft.attributes.filter((attribute) => attribute.trait_type === type);

    let totalWeight = 0;

    // Calcola la rarità per ciascun attributo del tipo specifico
    traitsOfType.forEach((attribute) => {
      const traitData = rarityType.values.find((value) => value.trait === attribute.value);
      if (traitData) {
        totalWeight += traitData.weight;
      }
    });

    return totalWeight;
  }

  public static getRarityByScore(score: number): string {
    if (score <= 10) {
      return "LEGENDARY";
    }
    if (score === 20) {
      return "EPIC";
    } else {
      return "COMMON";
    }
  }

  private static calculateTotalRarity(nft: Metadata): number {
    let totalRarity = 0;
    const uniqueTypes = [...new Set(nft.attributes.map((attribute) => attribute.trait_type))];

    uniqueTypes.forEach((type) => {
        const rarityForType = DataHelper.calculateRarityForType(type, nft.attributes);
        totalRarity += rarityForType; // Aggiungi il valore calcolato al totale invece di sovrascriverlo
    });

    return totalRarity;
}


  private static calculateRarityForType(types: string, attributes: Trait[]): number {
    let totalWeight = 0;
    const rarityType = RARITY.find((type) => type.type.toLowerCase() === types.toLowerCase());

    attributes.forEach((attribute) => {
        if (attribute.trait_type === types) {
            const traitData = rarityType.values.find((value) => value.trait.toLowerCase() === attribute.value.toLowerCase());
            if (traitData) {
                totalWeight += traitData.weight; // Utilizza l'operatore += per sommare il peso
            }
        }
    });

    return totalWeight;
}
 
  public static getScoreForNFT(nft: Metadata): number {
    let weightedSum = 0;

    // Verifica che nft.attributes sia definito prima di eseguire il loop
    if (nft.attributes) {
      // Ottieni un array di tipi distinti da nft.attributes
      const uniqueTypes = [...new Set(nft.attributes.map((attribute) => attribute.trait_type))];


      // Calcolo del punteggio basato sul tipo dell'NFT
      const totalRarity = DataHelper.calculateTotalRarity(nft);

      const finalScore = totalRarity

      return finalScore;
    } else {
      console.log("No attributes found for this NFT.");
      return 0;
    }
  }

  public static initialize() {
    for (const id in this.legendsMap) {
      console.log(`Initialized legend for ID ${id}: ${this.legendsMap[id]}`);
    }
  }

  public static getRarityListAsJSON() {
    const data = this.getRarityList(3200)
    return JSON.stringify(data)
  }
  
  public static getRarityList(totalSupply: number = 3200): ILegendsNFT[] {
    const nfts: ILegendsNFT[] = METADATA.map((n: Metadata, index) => {
      const score = this.getScoreForNFT(n);
      const rarity = this.getRarityByScore(score);
  
      const editionNumber = parseInt(n.edition, 10);

      // Utilizza il valore numerico di n.edition come chiave per accedere a legendsMap
      const legendName = this.legendsMap[editionNumber] || "Not A Legend";

      console.log(legendName);

      const rankNft = index + 1
  
      return { name: n.name, id: n.edition, score: score, rarity: rarity, legendName: legendName };
    });
  
    const filteredNFTs = nfts.filter((n) => n.id <= totalSupply);
    filteredNFTs.sort((a, b) => a.score - b.score);

  filteredNFTs.forEach((nft, index) => {
    nft.rank = index + 1; 
  });
  
    return filteredNFTs;
  }  
  
}

export default DataHelper;
