import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight, Share2 } from 'lucide-react'
import SiteLayout from '@/components/layout/SiteLayout'
import PropertyCard from '@/components/property/PropertyCard'
import { BLOG_POSTS, ALL_PROPERTIES } from '@/lib/mockData'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `https://digisoftnexus.com/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [{ url: post.coverImage.url, alt: post.coverImage.alt }],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  }
}

// Article Schema
function ArticleSchema({ post }: { post: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.url,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'DigiSoft Nexus',
      logo: { '@type': 'ImageObject', url: 'https://digisoftnexus.com/logo.png' },
    },
    datePublished: post.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://digisoftnexus.com/blog/${post.slug}` },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

// Generate comprehensive blog content based on post data
function generatePostContent(post: any): string {
  // In production this would come from the CMS / Django backend
  return `
${post.excerpt}

## Why This Matters in 2026

The Indian real estate market has reached an inflection point in 2026. Interest rates have stabilised,
the infrastructure push from NHAI and state governments has been unprecedented, and corporate 
hirings in NCR's technology, finance, and pharma sectors continue at a robust pace.

## Market Context: NCR Real Estate 2026

Gurugram remains the crown jewel of NCR real estate. With over 250,000 new office seats expected 
to be operational by Q3 2026, demand for quality residential properties within 5km of major 
employment hubs continues to outpace supply — a structural tailwind that will persist for years.

**Key data points for 2026:**
- Residential prices in Gurugram's new launch belt appreciated 18–22% in 2025
- Ready-to-move inventory is at a 7-year low — just 4,200 units across the city
- Pre-launch registrations for DLF Privana and M3M Capital received 3x oversubscription
- Rental yields for premium 2BHKs near cyber city now reach 4.2% annually

## What This Means for Buyers and Investors

For end-users, the window to purchase before further appreciation is narrowing. 
Properties that were priced at ₹1.2 Cr in early 2024 now command ₹1.5–1.6 Cr.

For investors, the risk-reward profile continues to favour real estate over equities for 
a 3–5 year horizon, particularly in the pre-launch space where alpha can be generated 
through selective deal-making with developers.

## Expert Recommendations

Our advisory team at Digisoft Nexus, with over 10 years in the NCR market, offers the following:

1. **Prioritise RERA-registered projects** — The HARERA (Haryana) portal is your first stop. 
   Verify RERA registration before any commitment.

2. **Evaluate the developer's delivery track record** — Godrej, DLF, and Sobha have strong 
   delivery histories. Newer developers require deeper diligence.

3. **Location over configuration** — A 2BHK in Sector 54 outperforms a 4BHK in a remote 
   location over any horizon.

4. **Pre-launch calculus** — Only participate in pre-launch through authorised channel partners 
   who can negotiate additional benefits (free parking, waived floor rise, etc.)

## Digisoft Nexus Verdict

The opportunity in Gurugram real estate remains compelling for 2026, but only for informed buyers 
who understand the micro-market dynamics. Generic advice no longer serves — the right sector, 
the right configuration, and the right developer make all the difference.

Our team is available for personalised advisory sessions at no cost. Reach us at 
+91 99999 99999 or explore our curated listings at digisoftnexus.com.
  `
}

export default function BlogPostPage({ params }: PageProps) {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  const content = post.content || generatePostContent(post)
  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2)
  const relatedProperties = ALL_PROPERTIES.slice(0, 3)

  return (
    <SiteLayout>
      <ArticleSchema post={post} />

      <div className="bg-cream min-h-screen">
        {/* Header */}
        <section className="bg-navy py-12 md:py-16 relative overflow-hidden">
          <div className="container-site relative z-10">
            <nav className="text-white/40 text-xs font-syne mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-white/70">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white/70">Blog</Link>
              <span>/</span>
              <span className="text-gold line-clamp-1">{post.title.slice(0, 40)}...</span>
            </nav>
            <div className="flex items-center gap-2 mb-4">
              <span className="badge bg-gold text-navy text-[10px]">{post.category}</span>
            </div>
            <h1 className="font-display text-hero-sm text-white mb-4 max-w-3xl">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 font-syne">
              <span className="flex items-center gap-1.5">
                {post.authorAvatar && <img src={post.authorAvatar} className="w-5 h-5 rounded-full" alt={post.author} />}
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {post.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {post.readTime} min read
              </span>
            </div>
          </div>
        </section>

        <div className="container-site py-8 md:py-12">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            {/* Main Content */}
            <article>
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                className="w-full rounded-xl2 shadow-luxury mb-8 h-72 object-cover"
              />

              <div className="bg-white rounded-xl2 shadow-card p-6 md:p-8 prose-custom">
                {/* Render markdown-like content */}
                {content.split('\n\n').map((para, i) => {
                  if (para.startsWith('## ')) {
                    return (
                      <h2 key={i} className="font-syne font-bold text-xl text-navy mt-8 mb-4 first:mt-0">
                        {para.replace('## ', '')}
                      </h2>
                    )
                  }
                  if (para.startsWith('**') && para.endsWith('**')) {
                    return (
                      <p key={i} className="font-semibold text-navy text-sm mb-3">
                        {para.replace(/\*\*/g, '')}
                      </p>
                    )
                  }
                  if (para.includes('\n-')) {
                    const lines = para.split('\n').filter(Boolean)
                    return (
                      <ul key={i} className="list-none space-y-2 my-4">
                        {lines.map((line, j) => (
                          line.startsWith('-') ? (
                            <li key={j} className="flex items-start gap-2 text-sm text-dark-grey">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                              <span dangerouslySetInnerHTML={{ __html: line.replace('- ', '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                            </li>
                          ) : (
                            <p key={j} className="text-sm text-dark-grey">{line}</p>
                          )
                        ))}
                      </ul>
                    )
                  }
                  if (para.trim()) {
                    return (
                      <p key={i} className="text-dark-grey text-sm leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
                      />
                    )
                  }
                  return null
                })}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                {post.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs font-syne text-dark-grey bg-white border border-navy/10 rounded-full px-3 py-1">
                    <Tag className="w-3 h-3 text-gold" />{tag}
                  </span>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <Link href="/blog" className="btn btn-outline btn-sm gap-2">
                  <ArrowLeft className="w-4 h-4" /> All Articles
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-24 space-y-5">
                {/* Related posts */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white rounded-xl2 p-5 shadow-card">
                    <h3 className="font-syne font-bold text-navy text-sm mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map(p => (
                        <Link key={p.id} href={`/blog/${p.slug}`} className="group flex gap-3">
                          <img
                            src={p.coverImage.url}
                            alt={p.coverImage.alt}
                            className="w-14 h-14 rounded-lg object-cover shrink-0"
                          />
                          <div>
                            <h4 className="font-syne font-semibold text-xs text-navy group-hover:text-gold transition-colors line-clamp-2">
                              {p.title}
                            </h4>
                            <p className="text-[10px] text-mid-grey mt-1">{p.readTime} min read</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured properties */}
                <div className="bg-white rounded-xl2 p-5 shadow-card">
                  <h3 className="font-syne font-bold text-navy text-sm mb-4">Featured Properties</h3>
                  <div className="space-y-3">
                    {relatedProperties.map(p => (
                      <Link key={p.id} href={`/properties/${p.slug}`} className="group flex gap-3 items-center">
                        <img src={p.primaryImage.url} alt={p.primaryImage.alt} className="w-12 h-10 rounded-lg object-cover shrink-0" />
                        <div>
                          <h4 className="font-syne font-semibold text-xs text-navy group-hover:text-gold transition-colors">{p.title}</h4>
                          <p className="text-[10px] text-gold font-semibold mt-0.5">{p.priceDisplay}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
