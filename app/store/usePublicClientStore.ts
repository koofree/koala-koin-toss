import { clientConfig } from '@/config';
import { createPublicClient, http, PublicClient } from 'viem';
import { create } from 'zustand';

interface _PublicClient {
  publicClient: PublicClient;
}

export const usePublicClientStore = create<_PublicClient>(() => {
  const publicClient = createPublicClient({
    ...clientConfig,
    transport: http(),
  }) as PublicClient;

  return { publicClient };
});
