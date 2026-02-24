'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, MapPin, ArrowRight, Bed, Maximize2, TrendingUp } from 'lucide-react'
import { useUIStore } from '@/store'

const mockProperties = [
  {
    id: '1', slug: 'godrej-emerald-sector-89', title: 'Godrej Emerald',
    developer: 'Godrej Properties', location: 'Sector 89, Gurugram',
    priceDisplay: '₹1.25 Cr onwards', bhkOptions: ['2BHK', '3BHK'],
    areaMin: 1150, areaMax: 1850, possessionStatus: 'new-launch',
    isNew: true, isLuxury: false,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    imageAlt: 'Godrej Emerald 3BHK luxury apartment Sector 89 Gurugram exterior view',
    tag: 'New Launch',  tagColor: 'bg-navy text-gold',
  },
  {
    id: '2', slug: 'dlf-the-camellias', title: 'DLF The Camellias',
    developer: 'DLF Limited', location: 'Golf Course Road, Gurugram',
    priceDisplay: '₹12 Cr onwards', bhkOptions: ['4BHK', '5BHK'],
    areaMin: 5800, areaMax: 11000, possessionStatus: 'ready-to-move',
    isNew: false, isLuxury: true,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    imageAlt: 'DLF Camellias ultra-luxury 5BHK penthouse Golf Course Road Gurugram',
    tag: 'Ultra Luxury', tagColor: 'bg-gold text-navy',
  },
  {
    id: '3', slug: 'm3m-altitude', title: 'M3M Altitude',
    developer: 'M3M India', location: 'Sector 65, Gurugram',
    priceDisplay: '₹2.8 Cr onwards', bhkOptions: ['3BHK', '4BHK'],
    areaMin: 2100, areaMax: 3200, possessionStatus: 'under-construction',
    isNew: false, isLuxury: true,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    imageAlt: 'M3M Altitude luxury 3BHK apartment Sector 65 Gurugram swimming pool view',
    tag: 'Under Construction', tagColor: 'bg-dark-grey/80 text-white',
  },
  {
    id: '4', slug: 'godrej-meridian', title: 'Godrej Meridian',
    developer: 'Godrej Properties', location: 'Sector 106, Gurugram',
    priceDisplay: '₹78 L onwards', bhkOptions: ['2BHK', '3BHK'],
    areaMin: 850, areaMax: 1350, possessionStatus: 'ready-to-move',
    isNew: false, isLuxury: false,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    imageAlt: 'Godrej Meridian 2BHK apartment Sector 106 Gurugram ready to move',
    tag: 'Ready to Move', tagColor: 'bg-success/90 text-white',
  },
]

const tabs = [
  { key: 'all', label: 'All Properties' },
  { key: 'new-launch', label: 'New Launch' },
  { key: 'ready-to-move', label: 'Ready to Move' },
  { key: 'luxury', label: 'Luxury' },
]

export default function FeaturedProperties() {
  const [activeTab, setActiveTab] = useState('all')
  const { toggleSaveProperty, savedProperties } = useUIStore()

  const filtered = activeTab === 'all'
    ? mockProperties
    : activeTab === 'luxury'
    ? mockProperties.filter(p => p.isLuxury)
    : mockProperties.filter(p => p.possessionStatus === activeTab)

  return (
    <section className="section bg-cream">
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="section-label mb-2">Handpicked For You</p>
            <h2 className="section-title">Featured Properties</h2>
          </div>
          <Link href="/properties" className="btn btn-ghost text-navy flex items-center gap-1 shrink-0">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-shrink-0 px-5 py-2 rounded-full font-syne text-sm font-medium transition-all duration-200
                ${activeTab === tab.key
                  ? 'bg-navy text-white shadow-luxury'
                  : 'bg-white text-dark-grey hover:text-navy border border-navy/10'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div className="card-property group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden img-hover-zoom">
                  <img
                    src={property.image}
                    alt={property.imageAlt}
                    className="img-luxury"
                  />
                  {/* Tag */}
                  <span className={`absolute top-3 left-3 badge text-[10px] ${property.tagColor}`}>
                    {property.tag}
                  </span>
                  {/* Save button */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleSaveProperty(property.id) }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-luxury flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Save property"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        savedProperties.includes(property.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-dark-grey'
                      }`}
                    />
                  </button>
                  {/* Price overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/80 to-transparent p-3">
                    <p className="text-gold font-display text-base font-semibold">
                      {property.priceDisplay}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <Link href={`/properties/${property.slug}`}>
                  <div className="p-4">
                    <p className="font-syne text-[10px] font-semibold uppercase tracking-wider text-gold mb-1">
                      {property.developer}
                    </p>
                    <h3 className="font-display text-lg font-semibold text-navy mb-1.5 group-hover:text-gold transition-colors">
                      {property.title}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-dark-grey mb-3">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      {property.location}
                    </p>

                    {/* Specs */}
                    <div className="flex items-center gap-3 text-xs text-dark-grey border-t border-navy/5 pt-3">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5" />
                        {property.bhkOptions.join(', ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" />
                        {property.areaMin}–{property.areaMax} sq ft
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
