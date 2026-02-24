import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteLayout from '@/components/layout/SiteLayout'
import PropertyDetailClient from './PropertyDetailClient'
import { ALL_PROPERTIES, getPropertyBySlug, getRelatedProperties } from '@/lib/mockData'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return ALL_PROPERTIES.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = getPropertyBySlug(params.slug)
  if (!property) return { title: 'Property Not Found' }

  return {
    title: property.metaTitle || `${property.title} | ${property.location} | DigiSoft Nexus`,
    description: property.metaDescription || property.description.slice(0, 160),
    openGraph: {
      title: property.metaTitle || property.title,
      description: property.metaDescription || property.description.slice(0, 160),
      url: `https://digisoftnexus.com/properties/${property.slug}`,
      images: [{ url: property.primaryImage.url, width: 1200, height: 630, alt: property.primaryImage.alt }],
      type: 'website',
    },
    alternates: { canonical: `https://digisoftnexus.com/properties/${property.slug}` },
  }
}

export const revalidate = 120

export default function PropertyDetailPage({ params }: PageProps) {
  const property = getPropertyBySlug(params.slug)
  if (!property) notFound()

  const related = getRelatedProperties(property, 3)

  // JSON-LD Schema — RealEstateListing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Apartment',
    name: property.title,
    description: property.description,
    url: `https://digisoftnexus.com/properties/${property.slug}`,
    image: property.images?.map(i => i.url) || [property.primaryImage.url],
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location,
      addressLocality: property.city,
      addressRegion: 'Haryana',
      addressCountry: 'IN',
    },
    offers: {
      '@type': 'Offer',
      price: property.priceMin,
      priceCurrency: 'INR',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: property.priceMin,
        maxPrice: property.priceMax,
        priceCurrency: 'INR',
      },
    },
    numberOfBedrooms: property.bhkOptions.length > 0 ? property.bhkOptions[0].replace('BHK', '').trim() : undefined,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.areaMin,
      unitCode: 'FTK',
    },
    additionalProperty: property.amenities.map(a => ({
      '@type': 'PropertyValue',
      name: a,
    })),
    ...(property.reraId && {
      identifier: {
        '@type': 'PropertyValue',
        name: 'RERA ID',
        value: property.reraId,
      },
    }),
  }

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the price of ${property.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${property.title} is priced from ${property.priceDisplay}. Apartments range from ${property.areaMin} to ${property.areaMax} sq ft with ${property.bhkOptions.join(', ')} configurations.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where is ${property.title} located?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${property.title} is located at ${property.location}, ${property.city}. It is developed by ${property.developer}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the possession date for ${property.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The possession date for ${property.title} is ${property.possessionDate || 'To be announced'}. Current status: ${property.possessionStatus.replace(/-/g, ' ')}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${property.title} RERA registered?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: property.reraId
            ? `Yes, ${property.title} is RERA registered. RERA ID: ${property.reraId}`
            : `Please contact us for current RERA registration details for ${property.title}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What amenities are available in ${property.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${property.title} offers ${property.amenities.slice(0, 5).join(', ')}, and more world-class amenities.`,
        },
      },
    ],
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://digisoftnexus.com' },
      { '@type': 'ListItem', position: 2, name: 'Properties', item: 'https://digisoftnexus.com/properties' },
      { '@type': 'ListItem', position: 3, name: property.title, item: `https://digisoftnexus.com/properties/${property.slug}` },
    ],
  }

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PropertyDetailClient property={property} relatedProperties={related} />
    </SiteLayout>
  )
}
