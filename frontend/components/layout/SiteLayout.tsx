"use client";
import Header from './Header'
import Footer from './Footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-[80px] md:pt-[112px]">
        {children}
      </main>
      <Footer />
    </div>
  )
}
