import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'KAIROS // PROTOCOL DASHBOARD',
  description: 'Execute at the perfect moment - Cross-chain intent execution protocol',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rpc.api.moonbase.moonbeam.network" />
        <link rel="dns-prefetch" href="https://rpc.api.moonbase.moonbeam.network" />
      </head>
      <body>
        <div className="matrix-bg"></div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
