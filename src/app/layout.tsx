import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JARVIS - Smart AI Assistant',
  description: 'Advanced bilingual AI assistant inspired by Iron Man\'s JARVIS. Features voice interaction, intelligent conversation, and real-time widgets.',
  keywords: ['AI', 'Assistant', 'JARVIS', 'Voice', 'Bilingual', 'Arabic', 'English'],
  authors: [{ name: 'JARVIS Team' }],
  openGraph: {
    title: 'JARVIS - Smart AI Assistant',
    description: 'Advanced bilingual AI assistant with voice interaction',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased bg-black text-white overflow-hidden`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}