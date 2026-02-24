import type { Metadata } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, ArrowRight, Search } from 'lucide-react'
import SiteLayout from '@/components/layout/SiteLayout'
import { BLOG_POSTS } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'Real Estate Blog & Insights | Gurugram Property Guide 2026 | DigiSoft Nexus',
  description: 'Expert real estate insights, investment guides, property comparisons, and hyperlocal Gurugram market analysis. Stay informed before you buy.',
  alternates: { canonical: 'https://digisoftnexus.com/blog' },
}

export const revalidate = false // SSG — revalidate on demand

const CATEGORIES = ['All', 'Investment', 'Analysis', 'Neighborhood Guide', 'Finance']

export default function BlogPage() {
  const featured = BLOG_POSTS[0]
  const rest = BLOG_POSTS.slice(1)

  return (
    <SiteLayout>
      {/* Header */}
      <section className="bg-navy py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="container-site relative z-10">
          <nav className="text-white/40 text-xs font-syne mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Blog</span>
          </nav>
          <h1 className="font-display text-hero-sm text-white mb-3">
            Real Estate Insights
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            Market analysis, investment guides, and hyperlocal Gurugram data — from our expert team.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-cream">
        <div className="container-site">
          {/* Featured Post */}
          <div className="mb-10">
            <p className="text-gold text-xs font-syne font-semibold uppercase tracking-widest mb-4">Featured Article</p>
            <Link href={`/blog/${featured.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white rounded-xl3 shadow-luxury overflow-hidden hover:shadow-luxury-md transition-all duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-1/2 h-56 md:h-auto relative overflow-hidden">
                    <img
                      src={featured.coverImage.url}
                      alt={featured.coverImage.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 badge bg-gold text-navy text-[10px]">
                      {featured.category}
                    </span>
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-mid-grey mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{featured.publishedAt}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.readTime} min read</span>
                    </div>
                    <h2 className="font-display text-display font-semibold text-navy mb-3 group-hover:text-gold transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-dark-grey text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-gold text-sm font-syne font-semibold flex items-center gap-1">
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Blog Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <article className="group bg-white rounded-xl2 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden h-full flex flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={post.coverImage.url}
                        alt={post.coverImage.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 badge bg-navy/80 text-white text-[9px]">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-[10px] text-mid-grey mb-2">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.publishedAt}</span>
                        <span>·</span>
                        <span>{post.readTime} min</span>
                      </div>
                      <h3 className="font-display text-base font-semibold text-navy mb-2 group-hover:text-gold transition-colors line-clamp-2 flex-1">
                        {post.title}
                      </h3>
                      <p className="text-dark-grey text-xs line-clamp-2 mb-3">{post.excerpt}</p>
                      <span className="text-gold text-xs font-syne font-semibold flex items-center gap-1 mt-auto">
                        Read More <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
