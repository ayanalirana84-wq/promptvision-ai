import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'PromptVision AI - Reverse Image to Prompt Converter',
  description: 'Upload any image to generate precise Midjourney v6 and Flux.1 prompts instantly for free.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link href="/" className="text-xl font-black tracking-tight text-sky-400">
            PromptVision<span className="text-white">.AI</span>
          </Link>
          <nav className="flex space-x-6 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-sky-400 transition">Tool</Link>
            <Link href="/prompts/midjourney-v6" className="hover:text-sky-400 transition">Midjourney Guide</Link>
            <Link href="/privacy-policy" className="hover:text-sky-400 transition">Privacy Policy</Link>
          </nav>
        </header>

        {children}

        <footer className="border-t border-slate-800 bg-slate-900 py-6 text-center text-xs text-slate-500">
          <p>© 2026 PromptVision AI. All rights reserved. | <Link href="/privacy-policy" className="underline hover:text-slate-400">Privacy Policy</Link></p>
        </footer>
      </body>
    </html>
  );
}