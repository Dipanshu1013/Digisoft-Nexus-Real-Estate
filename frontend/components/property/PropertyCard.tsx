'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, MapPin, Bed, Maximize2, Building2 } from 'lucide-react'
import type { Property } from '@/lib/mockData'

interface PropertyCardProps {
  property: Property
  index?: number
  savedIds?: string[]
  onToggleSave?: (id: string) => void
  layout?: 'grid' | 'list'
}

export default function PropertyCard({
  property,
  index = 0,
  savedIds = [],
  onToggleSave,
  layout = 'grid',
}: PropertyCardProps) {
  const isSaved = savedIds.includes(property.id)

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
        className="bg-white rounded-xl2 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex"
      >
        <div className="relative w-48 sm:w-64 shrink-0 overflow-hidden">
          <img
            src={property.primaryImage.url}
            alt={property.primaryImage.alt}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <span className={`absolute top-3 left-3 badge text-[10px] ${property.tagColor}`}>
            {property.tag}
          </span>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/80 to-transparent p-3">
            <p className="text-gold font-display text-base font-semibold">{property.priceDisplay}</p>
          </div>
        </div>
        <div className="p-5 flex-1">
          <p className="font-syne text-[10px] font-semibold uppercase tracking-wider text-gold mb-1">
            {property.developer}
          </p>
          <Link href={`/properties/${property.slug}`}>
            <h3 className="font-display text-xl font-semibold text-navy mb-1 hover:text-gold transition-colors">
              {property.title}
            </h3>
          </Link>
          <p className="flex items-center gap-1 text-xs text-dark-grey mb-3">
            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
            {property.location}
          </p>
          <p className="text-sm text-dark-grey line-clamp-2 mb-4">{property.description}</p>
          <div className="flex items-center gap-4 text-xs text-dark-grey border-t border-navy/5 pt-3">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-gold" />
              {property.bhkOptions.join(', ')}
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-gold" />
              {property.areaMin}–{property.areaMax} sq ft
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-gold" />
              {property.propertyType}
            </span>
          </div>
          <Link
            href={`/properties/${property.slug}`}
            className="btn btn-primary btn-sm mt-4"
          >
            View Details
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.36) }}
    >
      <div className="card-property group h-full flex flex-col">
        <div className="relative h-52 overflow-hidden img-hover-zoom">
          <img
            src={property.primaryImage.url}
            alt={property.primaryImage.alt}
            className="img-luxury"
            loading={index < 6 ? 'eager' : 'lazy'}
          />
          <span className={`absolute top-3 left-3 badge text-[10px] ${property.tagColor}`}>
            {property.tag}
          </span>
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(property.id)}
              aria-label={isSaved ? 'Remove from saved' : 'Save property'}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-dark-grey'}`}
              />
            </button>
          )}
          {property.isNew && (
            <div className="absolute top-3 right-3 bg-gold text-navy text-[9px] font-syne font-bold px-2 py-0.5 rounded-full">
              NEW
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/80 to-transparent p-3">
            <p className="text-gold font-display text-lg font-semibold">{property.priceDisplay}</p>
          </div>
        </div>

        <Link href={`/properties/${property.slug}`} className="flex-1 flex flex-col">
          <div className="p-4 flex-1">
            <p className="font-syne text-[10px] font-semibold uppercase tracking-wider text-gold mb-1">
              {property.developer}
            </p>
            <h3 className="font-display text-lg font-semibold text-navy mb-1 group-hover:text-gold transition-colors line-clamp-1">
              {property.title}
            </h3>
            <p className="flex items-center gap-1 text-xs text-dark-grey mb-3">
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
              {property.location}
            </p>
            <div className="flex items-center gap-3 text-xs text-dark-grey border-t border-navy/5 pt-3 mt-auto">
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
  )
}
