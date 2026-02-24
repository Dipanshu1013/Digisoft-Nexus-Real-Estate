import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Syne } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import GlobalPopupManager from '@/components/popup/GlobalPopupManager'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300','400','500','600','700'], style: ['normal','italic'], variable: '--font-cormorant', display: 'swap' })
const dmSans    = DM_Sans({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-dm-sans', display: 'swap' })
const syne      = Syne({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-syne', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://digisoftnexus.com'),
  title: { default: 'DigiSoft Real Estate — Premium Properties in Gurugram, Delhi NCR', template: '%s | DigiSoft Real Estate' },
  description: 'Discover premium real estate in Gurugram, Delhi NCR. Explore Godrej Properties, DLF, M3M and more with expert guidance from Digisoft Nexus.',
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${syne.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0A1628" />
      </head>
      <body className="font-sans bg-warm-white text-navy antialiased">
        <Suspense fallback={null}>
          {children}
          {/* Global popup system — renders on all pages */}
          <GlobalPopupManager triggerDelay={8000} scrollDepth={35} />
        </Suspense>
        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { fontFamily: 'var(--font-dm-sans)', fontSize: '14px', borderRadius: '12px', background: '#0A1628', color: '#fff' },
            success: { iconTheme: { primary: '#D4AF37', secondary: '#0A1628' } },
          }}
        />
      </body>
    </html>
  )
}
