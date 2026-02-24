import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Godrej Properties Gurugram | Premium Homes by DigiSoft Nexus',
    template: '%s | Godrej Properties Gurugram',
  },
  description:
    'Authorised channel partner for Godrej Properties in Gurugram. Godrej Emerald, Godrej Central and upcoming projects. Expert advisory, VIP pricing, RERA-verified.',
  keywords: ['Godrej Properties', 'Godrej Gurugram', 'Godrej Emerald', 'Godrej Central', 'Gurugram luxury apartments'],
  metadataBase: new URL('https://godrej.digisoftnexus.com'),
  openGraph: {
    siteName: 'Godrej Properties — DigiSoft Nexus',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  verification: { google: 'your-google-site-verification' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-[#F8FBF9] text-[#1A2E25] antialiased">
        {children}
      </body>
    </html>
  )
}
