'use client';

import { clientConfig } from '@/config';
import { AbstractWalletProvider } from '@abstract-foundation/agw-react';
import { http } from 'viem';

export default function AbstractWalletWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AbstractWalletProvider chain={clientConfig.chain} transport={http()}>
      {children}
    </AbstractWalletProvider>
  );
}
