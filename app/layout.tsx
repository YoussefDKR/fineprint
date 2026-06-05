import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Fineprint — AI Legal Copilot for Freelancers',
  description:
    'Understand any freelance contract in 30 seconds. Plain-English summaries, risk scoring, and negotiation emails.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans`}>{children}</body>
    </html>
  );
}
