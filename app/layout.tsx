import './globals.css';

export const metadata = {
  title: 'Firma Flip',
  description: 'A blockchain-based coin flipping game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900">{children}</body>
    </html>
  );
}
