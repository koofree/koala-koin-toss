export const formatAddress = (address: `0x${string}` | undefined, preLength = 4, sufLength = 4) => {
  if (!address) return '';
  return `${address.slice(0, preLength)}...${address.slice(-sufLength)}`;
};
