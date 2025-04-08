import { POOL_EDGE_DISCRIMINATOR } from '@/config';
import { formatUnits } from 'viem';

export const roundNumber = (number: number, precision: number = 8) => {
  return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
};

export const floorNumber = (number: number, precision: number = 8) => {
  return Math.floor(number * Math.pow(10, precision)) / Math.pow(10, precision);
};

export const calculateMultiplier = (
  rawGameOption: [number, number, number, string, number, bigint]
) => {
  return roundNumber(
    // origin: Number(formatUnits(rawGameOption[5], 8)) * (1 - 0.035) * POOL_EDGE_DISCRIMINATOR,
    Number(formatUnits(rawGameOption[5], 8)) * POOL_EDGE_DISCRIMINATOR,
    2
  );
};
