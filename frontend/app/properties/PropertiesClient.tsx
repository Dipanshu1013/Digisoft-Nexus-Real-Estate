'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MapPin, Bed, Maximize2, SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react'
import { useUIStore } from '@/store'

// Mock data for development — replace with API call
const MOCK_PROPERTIES = [
  { id:'1', slug:'godrej-emerald-sector-89', title:'Godrej Emerald', developer:'Godrej Properties', developerSlug:'godrej-properties', location:'Sector 89, Gurugram', city:'Gurugram', priceDisplay:'₹1.25 Cr onwards', priceMin:12500000, bhkOptions:['2BHK','3BHK'], areaMin:1150, areaMax:1850, possessionStatus:'new-launch', isNew:true, isLuxury:false, status:'available', primaryImage:{ url:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', alt:'Godrej Emerald 3BHK apartment Sector 89 Gurugram exterior view' }, tag:'New Launch', tagColor:'bg-navy text-gold' },
  { id:'2', slug:'dlf-the-camellias', title:'DLF The Camellias', developer:'DLF Limited', developerSlug:'dlf', location:'Golf Course Road, Gurugram', city:'Gurugram', priceDisplay:'₹12 Cr onwards', priceMin:120000000, bhkOptions:['4BHK','5BHK'], areaMin:5800, areaMax:11000, possessionStatus:'ready-to-move', isNew:false, isLuxury:true, status:'available', primaryImage:{ url:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', alt:'DLF Camellias ultra-luxury 5BHK Golf Course Road Gurugram' }, tag:'Ultra Luxury', tagColor:'bg-gold text-navy' },
  { id:'3', slug:'m3m-altitude-sector-65', title:'M3M Altitude', developer:'M3M India', developerSlug:'m3m', location:'Sector 65, Gurugram', city:'Gurugram', priceDisplay:'₹2.8 Cr onwards', priceMin:28000000, bhkOptions:['3BHK','4BHK'], areaMin:2100, areaMax:3200, possessionStatus:'under-construction', isNew:false, isLuxury:true, status:'available', primaryImage:{ url:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80', alt:'M3M Altitude luxury 3BHK apartment Sector 65 Gurugram' }, tag:'Under Construction', tagColor:'bg-dark-grey/80 text-white' },
  { id:'4', slug:'godrej-meridian-sector-106', title:'Godrej Meridian', developer:'Godrej Properties', developerSlug:'godrej-properties', location:'Sector 106, Gurugram', city:'Gurugram', priceDisplay:'₹78 L onwards', priceMin:7800000, bhkOptions:['2BHK','3BHK'], areaMin:850, areaMax:1350, possessionStatus:'ready-to-move', isNew:false, isLuxury:false, status:'available', primaryImage:{ url:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', alt:'Godrej Meridian 2BHK apartment Sector 106 Gurugram ready to move' }, tag:'Ready to Move', tagColor:'bg-success/90 text-white' },
  { id:'5', slug:'m3m-capital-sector-113', title:'M3M Capital Walk', developer:'M3M India', developerSlug:'m3m', location:'Sector 113, Gurugram', city:'Gurugram', priceDisplay:'₹1.8 Cr onwards', priceMin:18000000, bhkOptions:['2BHK','3BHK'], areaMin:1400, areaMax:2200, possessionStatus:'pre-launch', isNew:true, isLuxury:false, status:'available', primaryImage:{ url:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80', alt:'M3M Capital Walk 3BHK apartment Sector 113 Gurugram pre-launch' }, tag:'Pre-Launch', tagColor:'bg-amber-500 text-white' },
  { id:'6', slug:'dlf-privana-sector-77', title:'DLF Privana', developer:'DLF Limited', developerSlug:'dlf', location:'Sector 77, Gurugram', city:'Gurugram', priceDisplay:'₹3.5 Cr onwards', priceMin:35000000, bhkOptions:['3BHK','4BHK'], areaMin:2500, areaMax:3800, possessionStatus:'new-launch', isNew:true, isLuxury:true, status:'available', primaryImage:{ url:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', alt:'DLF Privana 3BHK luxury apartment Sector 77 Gurugram new launch' }, tag:'New Launch', tagColor:'bg-navy text-gold' },
]

const FILTERS_CONFIG = {
  city: [
    { value: '', label: 'All Cities' },
    { value: 'Gurugram', label: 'Gurugram' },
    { value: 'Noida', label: 'Noida' },
    { value: 'Delhi', label: 'Delhi' },
  ],
  developer: [
    { value: '', label: 'All Developers' },
    { value: 'godrej-properties', label: 'Godrej Properties' },
    { value: 'dlf', label: 'DLF' },
    { value: 'm3m', label: 'M3M India' },
  ],
  possession: [
    { value: '', label: 'All Status' },
    { value: 'ready-to-move', label: 'Ready to Move' },
    { value: 'new-launch', label: 'New Launch' },
    { value: 'pre-launch', label: 'Pre-Launch' },
    { value: 'under-construction', label: 'Under Construction' },
  ],
  budget: [
    { value: '', label: 'Any Budget' },
    { value: '5000000', label: 'Under ₹50 Lakh' },
    { value: '10000000', label: '₹50L – ₹1 Cr' },
    { value: '30000000', label: '₹1 Cr – ₹3 Cr' },
    { value: '100000000', label: '₹3 Cr – ₹10 Cr' },
    { value: '999999999', label: '₹10 Cr+' },
  ],
}

export default function PropertiesClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toggleSaveProperty, savedProperties } = useUIStore()

  const [filters, setFilters] = useState({
    city:        searchParams.get('city') || '',
    developer:   searchParams.get('developer') || '',
    possession:  searchParams.get('status') || '',
    budget:      '',
    search:      searchParams.get('search') || '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('featured')

  // Client-side filtering of mock data (replace with API call in production)
  const filtered = MOCK_PROPERTIES.filter(p => {
    if (filters.city && p.city !== filters.city) return false
    if (filters.developer && p.developerSlug !== filters.developer) return false
    if (filters.possession && p.possessionStatus !== filters.possession) return false
    if (filters.budget && p.priceMin > parseInt(filters.budget)) return false
    if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !p.location.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const updateFilter = (key: string, val: string) => {
    setFilters(f => ({ ...f, [key]: val }))
  }

  const clearFilters = () => {
    setFilters({ city: '', developer: '', possession: '', budget: '', search: '' })
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="container-site py-8">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-grey" />
          <input
            type="text"
            placeholder="Search by project, location, developer..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            className="form-input pl-10"
          />
        </div>

        {/* Filter toggle (mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-outline btn-sm gap-2 flex-shrink-0 relative"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort */}
        <div className="relative flex-shrink-0">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="form-input pr-8 appearance-none cursor-pointer min-w-[160px] py-3"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-grey pointer-events-none" />
        </div>
      </div>

      {/* Filter bar (collapsible on mobile, always visible on desktop) */}
      <AnimatePresence>
        {(showFilters || true) && (
          <motion.div
            initial={false}
            className="hidden md:flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl border border-navy/8"
          >
            {/* City */}
            <FilterSelect label="City" options={FILTERS_CONFIG.city} value={filters.city} onChange={v => updateFilter('city', v)} />
            <FilterSelect label="Developer" options={FILTERS_CONFIG.developer} value={filters.developer} onChange={v => updateFilter('developer', v)} />
            <FilterSelect label="Status" options={FILTERS_CONFIG.possession} value={filters.possession} onChange={v => updateFilter('possession', v)} />
            <FilterSelect label="Budget" options={FILTERS_CONFIG.budget} value={filters.budget} onChange={v => updateFilter('budget', v)} />

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-error font-syne font-semibold px-3 py-2 rounded-lg hover:bg-error/5 transition-colors">
                <X className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-dark-grey">
          <span className="font-syne font-semibold text-navy">{filtered.length}</span> properties found
        </p>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-gold font-semibold hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* Property Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🏠</p>
          <h3 className="font-syne font-semibold text-lg text-navy mb-2">No properties match your filters</h3>
          <p className="text-dark-grey text-sm mb-5">Try adjusting your search criteria</p>
          <button onClick={clearFilters} className="btn btn-primary btn-sm">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.36) }}
            >
              <div className="card-property group">
                <div className="relative h-52 overflow-hidden img-hover-zoom">
                  <img src={property.primaryImage.url} alt={property.primaryImage.alt} className="img-luxury" />
                  <span className={`absolute top-3 left-3 badge text-[10px] ${property.tagColor}`}>{property.tag}</span>
                  <button
                    onClick={() => toggleSaveProperty(property.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className={`w-4 h-4 ${savedProperties.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-dark-grey'}`} />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/80 to-transparent p-3">
                    <p className="text-gold font-display text-lg font-semibold">{property.priceDisplay}</p>
                  </div>
                </div>
                <Link href={`/properties/${property.slug}`}>
                  <div className="p-4">
                    <p className="font-syne text-[10px] font-semibold uppercase tracking-wider text-gold mb-1">{property.developer}</p>
                    <h3 className="font-display text-lg font-semibold text-navy mb-1 group-hover:text-gold transition-colors">{property.title}</h3>
                    <p className="flex items-center gap-1 text-xs text-dark-grey mb-3">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />{property.location}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-dark-grey border-t border-navy/5 pt-3">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.bhkOptions.join(', ')}</span>
                      <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{property.areaMin}–{property.areaMax} sq ft</span>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterSelect({ label, options, value, onChange }: {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="form-label">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm border border-navy/15 rounded-lg px-3 py-2 bg-white text-navy outline-none focus:border-gold cursor-pointer min-w-[140px]"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
