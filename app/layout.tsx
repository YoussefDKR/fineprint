import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
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
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} bg-canvas text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
