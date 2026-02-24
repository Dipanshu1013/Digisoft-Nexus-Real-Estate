'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Rohit & Priya Sharma',
    location: 'Bought 3BHK in Godrej Emerald, Sector 89',
    rating: 5,
    review: 'DigiSoft Nexus made our home buying journey completely stress-free. Our relationship manager Aakash was available 24/7, helped us negotiate the price, and handled all documentation. We got a better price than the builder\'s official rate!',
    avatar: 'RS',
    property: 'Godrej Emerald',
  },
  {
    name: 'Vivek Malhotra',
    location: 'Investor — 2 units in M3M Altitude, Sector 65',
    rating: 5,
    review: 'I was sceptical about digital platforms for high-value transactions, but DigiSoft Nexus proved me wrong. Their ROI analysis for M3M Altitude was spot-on. Both my units are already showing 18% appreciation in 14 months. Highly recommend!',
    avatar: 'VM',
    property: 'M3M Altitude',
  },
  {
    name: 'Sunita Agarwal',
    location: 'NRI Buyer — DLF Luxury, Golf Course Rd',
    rating: 5,
    review: 'As an NRI buying property in India, I was worried about being misled. DigiSoft Nexus handled everything remotely — legal verification, NRI compliance paperwork, loan processing — with complete transparency. I never felt like I was at a disadvantage.',
    avatar: 'SA',
    property: 'DLF Luxury',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section className="section bg-cream">
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Real Stories</p>
          <h2 className="section-title mb-4">What Our Clients Say</h2>
          <div className="divider-gold-center" />
        </div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-xl4 shadow-luxury p-8 md:p-10 border border-navy/5 relative"
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-8 text-gold/15">
                <Quote className="w-14 h-14" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonials[active].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>

              <p className="font-display text-lg md:text-xl text-navy leading-relaxed mb-8 italic">
                "{testimonials[active].review}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center">
                  <span className="font-syne font-semibold text-gold text-sm">
                    {testimonials[active].avatar}
                  </span>
                </div>
                <div>
                  <p className="font-syne font-semibold text-sm text-navy">
                    {testimonials[active].name}
                  </p>
                  <p className="text-xs text-dark-grey">
                    {testimonials[active].location}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="badge badge-gold text-[10px]">
                    {testimonials[active].property}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-navy/15 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active
                      ? 'w-6 h-2 bg-navy'
                      : 'w-2 h-2 bg-navy/20'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActive((a) => (a + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-navy/15 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
