import Link from 'next/link'
import { ArrowRight, Clock, TrendingUp } from 'lucide-react'

const mockPosts = [
  {
    slug: 'gurugram-real-estate-2026-investment-guide',
    title: 'Gurugram Real Estate 2026: Complete Investment Guide',
    excerpt: 'Sector-wise price trends, upcoming infrastructure, and why Gurugram remains the top investment destination in North India.',
    category: 'Investment Guide',
    readTime: 8,
    publishedAt: '2026-01-15',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    imageAlt: 'Gurugram skyline real estate investment guide 2026',
    isTrending: true,
  },
  {
    slug: 'godrej-vs-dlf-vs-m3m-comparison',
    title: 'Godrej vs DLF vs M3M: Which Developer Should You Choose in 2026?',
    excerpt: 'A detailed comparison of India\'s top developers — construction quality, delivery track record, pricing, and post-possession support.',
    category: 'Comparison',
    readTime: 12,
    publishedAt: '2026-01-08',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    imageAlt: 'Compare Godrej DLF M3M developers luxury apartments Gurugram',
    isTrending: false,
  },
  {
    slug: 'home-loan-guide-2026',
    title: 'Home Loan Guide 2026: Best Rates, Process & Hidden Costs Explained',
    excerpt: 'Everything you need to know before applying for a home loan — interest rates, processing fees, documentation, and tips to get approved.',
    category: 'Finance',
    readTime: 10,
    publishedAt: '2025-12-28',
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=600&q=80',
    imageAlt: 'Home loan guide 2026 interest rates India property finance',
    isTrending: false,
  },
]

export default function BlogTeaser() {
  return (
    <section className="section bg-warm-white">
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-label mb-2">Expert Insights</p>
            <h2 className="section-title">Real Estate Knowledge Hub</h2>
          </div>
          <Link href="/blog" className="btn btn-ghost text-navy flex items-center gap-1 shrink-0">
            All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="card-hover group h-full overflow-hidden">
                <div className="relative h-44 overflow-hidden img-hover-zoom">
                  <img src={post.image} alt={post.imageAlt} className="img-luxury" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                  {post.isTrending && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-gold text-navy px-2.5 py-1 rounded-full text-[10px] font-syne font-semibold">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 badge badge-navy text-[10px]">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold text-navy leading-snug mb-2 group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-dark-grey leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-mid-grey">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min read
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
