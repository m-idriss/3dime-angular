/**
 * SEO tag configuration interface
 */
export interface SeoTagConfig {
  /** Page title */
  title?: string;
  /** Meta description */
  description?: string;
  /** Meta keywords (comma-separated) */
  keywords?: string[];
  /** Author name */
  author?: string;
  /** Open Graph image URL */
  image?: string;
  /** Canonical URL */
  url?: string;
  /** Open Graph type (e.g., 'website', 'article') */
  type?: string;
  /** Twitter card type */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  /** Twitter handle */
  twitterSite?: string;
  /** Twitter creator handle */
  twitterCreator?: string;
  /** Robots meta tag */
  robots?: string;
}

/**
 * JSON-LD structured data types
 */
export type JsonLdType = 
  | 'Person'
  | 'Organization'
  | 'WebSite'
  | 'Article'
  | 'BlogPosting'
  | 'BreadcrumbList'
  | string;

/**
 * Generic JSON-LD schema interface
 */
export interface JsonLdSchema {
  '@context': string;
  '@type': JsonLdType;
  [key: string]: any;
}
