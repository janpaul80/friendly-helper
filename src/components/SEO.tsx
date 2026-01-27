import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  schema?: Record<string, unknown>;
  noindex?: boolean;
}

const DEFAULT_TITLE = 'HeftCoder - AI-Powered Code Generation Platform';
const DEFAULT_DESCRIPTION = 'Build production-ready applications in minutes with autonomous AI agents. HeftCoder transforms your ideas into reality with intelligent code generation.';
const DEFAULT_IMAGE = 'https://app.heftcoder.icu/assets/og-image.png';
const BASE_URL = 'https://app.heftcoder.icu';

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'AI code generation, autonomous agents, software development, React, TypeScript, HeftCoder',
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  schema,
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | HeftCoder` : DEFAULT_TITLE;
  const canonicalUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to set meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Helper to set link tag
    const setLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // Basic meta tags
    setMeta('description', description);
    setMeta('keywords', keywords);
    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }

    // Open Graph tags
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', 'HeftCoder', true);
    setMeta('og:locale', 'en_US', true);

    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
    setMeta('twitter:site', '@heftcoder');

    // Canonical URL
    setLink('canonical', canonicalUrl);

    // Schema.org structured data
    if (schema) {
      let scriptTag = document.querySelector('script[data-schema="heftcoder"]') as HTMLScriptElement;
      
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.setAttribute('data-schema', 'heftcoder');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    }

    // Cleanup function - remove schema on unmount
    return () => {
      const schemaScript = document.querySelector('script[data-schema="heftcoder"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [fullTitle, description, keywords, image, canonicalUrl, type, schema, noindex]);

  return null; // This component only manages document head
}

// Pre-built schemas for common page types
export const schemas = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HeftCoder',
    url: 'https://app.heftcoder.icu',
    logo: 'https://app.heftcoder.icu/assets/hc-icon.png',
    description: 'AI-powered code generation platform for building production-ready applications',
    founder: {
      '@type': 'Person',
      name: 'JP Hartmann',
      jobTitle: 'CEO & Founder',
    },
    sameAs: [
      'https://github.com/heftcoder',
      'https://twitter.com/heftcoder',
    ],
  },

  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HeftCoder',
    operatingSystem: 'Web',
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  },

  faq: (items: { question: string; answer: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }),

  breadcrumb: (items: { name: string; url: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://app.heftcoder.icu${item.url}`,
    })),
  }),
};
