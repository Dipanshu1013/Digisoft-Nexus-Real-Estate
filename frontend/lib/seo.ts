/**
 * DigiSoft Nexus — Complete SEO Utility Library (Phase 8)
 * Handles all metadata, JSON-LD schemas, breadcrumbs, sitemap
 */

import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://digisoftnexus.com';
const SITE_NAME = 'DigiSoft Nexus';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

// ─── Base Metadata Generator ────────────────────────────────────
export function buildMetadata({
  title,
  description,
  slug = '',
  ogImage,
  noIndex = false,
  keywords = [],
}: {
  title: string;
  description: string;
  slug?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}/${slug}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

// ─── JSON-LD Schema Generators ──────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-98765-43210',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Cyber City, DLF Phase 3',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122002',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.facebook.com/digisoftnexus',
      'https://www.instagram.com/digisoftnexus',
      'https://www.linkedin.com/company/digisoftnexus',
    ],
  };
}

export function realEstateListingSchema({
  name,
  description,
  price,
  priceMin,
  priceMax,
  address,
  image,
  url,
  developer,
  bedrooms,
  area,
  rera,
}: {
  name: string;
  description: string;
  price?: string;
  priceMin?: number;
  priceMax?: number;
  address: string;
  image: string;
  url: string;
  developer?: string;
  bedrooms?: string;
  area?: string;
  rera?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name,
    description,
    url: `${SITE_URL}${url}`,
    image,
    ...(price && { price }),
    ...(priceMin && priceMax && {
      priceRange: `₹${(priceMin / 10000000).toFixed(1)} Cr — ₹${(priceMax / 10000000).toFixed(1)} Cr`,
    }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      addressCountry: 'IN',
    },
    ...(developer && {
      seller: { '@type': 'Organization', name: developer },
    }),
    ...(bedrooms && { numberOfRooms: bedrooms }),
    ...(area && { floorSize: { '@type': 'QuantitativeValue', value: area, unitCode: 'SQF' } }),
    ...(rera && { identifier: { '@type': 'PropertyValue', name: 'RERA', value: rera } }),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: SITE_NAME,
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: '+91-98765-43210',
    email: 'info@digisoftnexus.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Cyber City, DLF Phase 3',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122002',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.4595,
      longitude: 77.0266,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
    priceRange: '₹₹₹',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '347',
    },
  };
}

export function articleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  slug,
  authorName = 'DigiSoft Nexus Team',
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  slug: string;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author: { '@type': 'Organization', name: authorName },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
  };
}

// ─── JSON-LD Script Component Helper ───────────────────────────
export function jsonLdScript(data: object) {
  return JSON.stringify(data);
}
