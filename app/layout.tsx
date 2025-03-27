import NextAbstractWalletProvider from './components/NextAbstractWalletProvider';
import './globals.css';

export const metadata = {
  title: 'Firma Flip',
  description: 'A blockchain-based coin flipping game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <NextAbstractWalletProvider>
        <body className="min-h-screen bg-gray-100">{children}</body>
      </NextAbstractWalletProvider>
    </html>
  );
}
