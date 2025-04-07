import { Address, decodeEventLog, erc20Abi, formatUnits, TransactionReceipt } from 'viem';

export const getErc20Transfer = async (
  receipt: TransactionReceipt,
  receiver: Address
): Promise<number | undefined> => {
  try {
    // Check for token transfer events in the logs
    const transferLogs = receipt.logs.filter((log) => {
      // Common ERC20 Transfer event signature
      return log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
    });

    if (transferLogs.length > 0) {
      // You can decode the logs here if needed
      const decodedLogs = transferLogs.map((log) =>
        decodeEventLog({ abi: erc20Abi, data: log.data, topics: log.topics })
      );
      const filteredLogs = decodedLogs.filter(
        (v) => v.eventName === 'Transfer' && v.args.to === receiver
      );

      const filteredLog = filteredLogs[0];

      return Number(formatUnits(filteredLog?.args?.value, 18));
    }
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
  }
};
