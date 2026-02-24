/**
 * DigiSoft Nexus — HTML Sitemap Page
 * Route: /sitemap — For users and search engines
 */
import Link from 'next/link';
import { buildMetadata, breadcrumbSchema, jsonLdScript } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Sitemap — DigiSoft Nexus',
  description: 'Complete HTML sitemap of DigiSoft Nexus — find all properties, developers, cities, calculators, and resources.',
  slug: 'sitemap',
});

const sitemapData = [
  {
    category: 'Properties',
    icon: '🏠',
    links: [
      { label: 'All Properties', href: '/properties' },
      { label: 'Luxury Properties', href: '/luxury' },
      { label: 'Affordable Homes', href: '/affordable' },
      { label: 'Commercial Properties', href: '/commercial' },
      { label: 'Pre-Launch Projects', href: '/pre-launch' },
      { label: 'New Launch Projects', href: '/new-launch' },
    ],
  },
  {
    category: 'Developers',
    icon: '🏢',
    links: [
      { label: 'Godrej Properties', href: '/projects/godrej-properties' },
      { label: 'DLF Properties', href: '/projects/dlf' },
      { label: 'M3M Properties', href: '/projects/m3m' },
    ],
  },
  {
    category: 'Locations',
    icon: '📍',
    links: [
      { label: 'Gurugram Real Estate', href: '/gurugram' },
      { label: 'Delhi NCR Properties', href: '/delhi-ncr' },
      { label: 'Noida Properties', href: '/noida' },
    ],
  },
  {
    category: 'Buy / Rent / Invest',
    icon: '💼',
    links: [
      { label: 'Buy Property', href: '/buy' },
      { label: 'Rent Property', href: '/rent' },
      { label: 'Real Estate Investment', href: '/invest' },
      { label: 'VIP Early Access', href: '/vip-access' },
    ],
  },
  {
    category: 'Calculators',
    icon: '🧮',
    links: [
      { label: 'EMI Calculator', href: '/calculator/emi' },
      { label: 'ROI Calculator', href: '/calculator/roi' },
      { label: 'Stamp Duty Calculator', href: '/calculator/stamp-duty' },
    ],
  },
  {
    category: 'Resources',
    icon: '📚',
    links: [
      { label: 'Blog & Insights', href: '/blog' },
      { label: 'Client Testimonials', href: '/testimonials' },
      { label: 'Why Choose Us', href: '/why-us' },
    ],
  },
  {
    category: 'Company',
    icon: '🏛️',
    links: [
      { label: 'About DigiSoft Nexus', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function SitemapPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Sitemap', url: '/sitemap' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema(breadcrumbs)) }}
      />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-navy py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <nav className="text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Sitemap</span>
            </nav>
            <h1 className="text-4xl font-bold text-white mb-3">Site Map</h1>
            <p className="text-white/70 text-lg">Find everything on DigiSoft Nexus — properties, developers, tools, and more.</p>
          </div>
        </section>

        {/* Sitemap Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sitemapData.map((section) => (
                <div key={section.category} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{section.icon}</span>
                    <h2 className="text-lg font-bold text-navy">{section.category}</h2>
                  </div>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-gray-600 hover:text-gold transition-colors text-sm flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
