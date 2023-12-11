import DataHelper from "./helpers/DataHelper"
import fs from 'fs';
import path from 'path';
/* eslint-disable no-const-assign */

interface Allocation {
  category: string;
  range: [number, number];
  percentage: number;
}

interface Identity {
  rank: string;
  range: [number, number];
  allocated: number;
}


export function distributeCRO(): Identity[] {
  const totalAmount: number = 3200;
  const totalRanges: number = 3200;
  const categories: Allocation[] = [
    { category: "Legendary#1", range: [1, 1], percentage: 0.2 },
    { category: "Legendary#2", range: [2, 2], percentage: 0.2 },
    { category: "Legendary#3", range: [3, 3], percentage: 0.2 },
    { category: "Legendary#4", range: [4, 4], percentage: 0.2 },
    { category: "Legendary#5", range: [5, 5], percentage: 0.2 },
    { category: "Legendary#6", range: [6, 6], percentage: 0.2 },
    { category: "Legendary#7", range: [7, 7], percentage: 0.2 },
    { category: "Legendary#8", range: [8, 8], percentage: 0.2 },
    { category: "Legendary#9", range: [9, 9], percentage: 0.2 },
    { category: "Legendary#10", range: [10, 10], percentage: 0.2 },
    { category: "Legendary#11", range: [11, 11], percentage: 0.2 },
    { category: "Legendary#12", range: [12, 12], percentage: 0.2 },
    { category: "Legendary#13", range: [13, 13], percentage: 0.2 },
    { category: "Epic", range: [13, 17], percentage: 13 },
    { category: "Common", range: [18, 3200], percentage: 23 },
  ];

  const sortedCategories = categories.sort((a, b) => a.range[0] - b.range[0]);

  const allocations: Identity[] = [];

  let remainingAmount: number = totalAmount;
  let remainingRanges: number = totalRanges;

  for (const category of sortedCategories) {
    const { range, percentage } = category;

    const [startRange, endRange] = range;
    const rangeSize: number = endRange - startRange + 1;

    const categoryAmount: number = totalAmount * (percentage / 100);
    const allocationPerRange: number = categoryAmount / rangeSize;

    const categoryAllocation: Identity[] = [];

    for (let i = startRange; i <= endRange; i++) {
      const allocation: number = allocationPerRange * (1 + (endRange - i) / rangeSize);
      categoryAllocation.push({ rank: category.category, range: [i, category.range[1]], allocated: allocation });
    }

    allocations.push(...categoryAllocation);

    remainingAmount -= categoryAmount;
    remainingRanges -= rangeSize;
  }

  const remainingAllocationPerRange: number = remainingAmount / remainingRanges;

  for (const allocation of allocations) {
    if (allocation.allocated === 0) {
      allocation.allocated = remainingAllocationPerRange;
    }
  }

  return allocations;
}

export const CreateTraitsList = async () => {
  const rarityListJSON = DataHelper.getRarityListAsJSON();
  const folderPath = path.join(__dirname, 'traits');
  const filePath = path.join(folderPath, 'LogicRedistributionArray.json');

  // Verifica se la cartella esiste, altrimenti creala
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  try {
    fs.writeFileSync(filePath, rarityListJSON, 'utf-8');
    console.log('File "LogicRedistributionArray.json" creato con successo nella cartella /traits');
  } catch (error) {
    console.error('Errore durante la creazione del file:', error);
  }
}

export const CreateDistList = async (): Promise<void> => {
  const rarityList = distributeCRO();
  const rarityListJSON: string = JSON.stringify(rarityList);
  const folderPath = path.join(__dirname, 'traits');
  const filePath = path.join(folderPath, 'distribution-list-based-on-perc.json');

  // Verifica se la cartella esiste, altrimenti creala
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  try {
    fs.writeFileSync(filePath, rarityListJSON, 'utf-8');
    console.log('File "distribution-list-based-on-perc.json" creato con successo nella cartella /traits');
  } catch (error) {
    console.error('Errore durante la creazione del file:', error);
  }
}


CreateDistList()
CreateTraitsList()

