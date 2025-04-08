export const formatAddress = (address: `0x${string}` | undefined, preLength = 4, sufLength = 4) => {
  if (!address) return '';
  return `${address.slice(0, preLength)}...${address.slice(-sufLength)}`;
};

export const dateFormat = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day.toString().padStart(2, '0')} ${month} ${time}`;
};
