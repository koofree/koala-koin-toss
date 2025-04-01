import { STORAGE_KEY_PREFIX } from '@/config';
import type { Address } from 'viem';

/**
 * @function getStorageKey
 * @description Retrieves a storage key for a specific wallet address
 *
 * This function generates a storage key for a specific wallet address by concatenating the
 * storage key prefix (defined in constants.ts) with the wallet address.
 *
 * The storage key is used to store session data in local storage.
 *
 * @param {Address} userAddress - The wallet address to get or generate an encryption key for
 *
 * @returns {Promise<string>} A promise that resolves to a string that can be used to store session data in local storage
 */
export const getStorageKey = async (userAddress: Address): Promise<string> => {
  console.log('Getting storage key for address:', userAddress);
  return `${STORAGE_KEY_PREFIX}${userAddress}`;
};
