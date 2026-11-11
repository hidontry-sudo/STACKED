import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'STACKED | Stack Knowledge. Stack Wealth.',
  description: 'Gamified financial literacy web application with interactive simulation engines, video modules, and AI quizzes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0c0c0e] text-zinc-100 min-h-screen antialiased selection:bg-amber-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
