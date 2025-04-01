'use client';

import { clientConfig } from '@/config';
import { AbstractWalletProvider } from '@abstract-foundation/agw-react';

export default function AbstractWalletWrapper({ children }: { children: React.ReactNode }) {
  return <AbstractWalletProvider config={clientConfig}>{children}</AbstractWalletProvider>;
}
