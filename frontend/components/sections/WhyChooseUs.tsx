'use client'
import { motion } from 'framer-motion'
import { Shield, Users, TrendingUp, Clock, Award, Headphones } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Zero Hidden Charges',
    description: 'Complete transparency in pricing. What you see is exactly what you pay — no surprise fees or commissions.',
  },
  {
    icon: Users,
    title: 'Dedicated Relationship Manager',
    description: 'A single point of contact throughout your buying journey — from shortlisting to possession.',
  },
  {
    icon: TrendingUp,
    title: 'Best Price Guaranteed',
    description: 'Being authorized channel partners, we get you exclusive pricing unavailable on public portals.',
  },
  {
    icon: Clock,
    title: 'End-to-End Support',
    description: 'We handle paperwork, legal verification, home loans, and registration — so you focus on choosing your home.',
  },
  {
    icon: Award,
    title: 'RERA Registered',
    description: 'All projects we recommend are RERA compliant. We verify every project before listing on our platform.',
  },
  {
    icon: Headphones,
    title: '7-Day Customer Support',
    description: 'Reachable on WhatsApp, call, and email every day of the week — even on public holidays.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="section bg-navy relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container-site relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Our Promise</p>
          <h2 className="font-display text-section md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
            Why Thousands Trust Digisoft Nexus
          </h2>
          <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            We are not just a portal — we are your personal real estate guide, negotiator, and advisor.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white/4 border border-white/8 rounded-xl3 p-6 hover:bg-white/7 hover:border-gold/25 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center mb-4 group-hover:bg-gold/25 transition-colors">
                <feature.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-syne font-semibold text-base text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
