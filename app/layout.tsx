import type { Metadata } from 'next';
import { Inter_Tight, Space_Grotesk, Geist } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
});

export const metadata: Metadata = {
  title: 'ASI Mates',
  description: 'Transform Your Workforce with AI Agents as Employees and Intelligent Human Assistance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} ${spaceGrotesk.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
