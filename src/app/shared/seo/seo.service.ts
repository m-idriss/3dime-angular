import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SeoTagConfig, JsonLdSchema } from './seo.models';

/**
 * SEO Service for managing page metadata, Open Graph tags, and JSON-LD structured data
 * 
 * This service provides a centralized way to manage SEO tags dynamically,
 * keeping index.html clean and maintainable.
 * 
 * @example
 * ```typescript
 * constructor(private seoService: SeoService) {}
 * 
 * ngOnInit() {
 *   this.seoService.updateTags({
 *     title: 'My Portfolio – Java & Angular Developer',
 *     description: 'Showcasing my projects and skills...',
 *     keywords: ['Java', 'Angular', 'Spring Boot'],
 *     image: 'https://example.com/preview.png',
 *     url: 'https://example.com'
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private renderer: Renderer2;
  private jsonLdScripts: Map<string, HTMLScriptElement> = new Map();

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    private rendererFactory: RendererFactory2,
    private http: HttpClient
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Update page title and meta tags
   * 
   * @param config SEO tag configuration
   * 
   * @example
   * ```typescript
   * this.seoService.updateTags({
   *   title: 'About Me',
   *   description: 'Learn more about my experience',
   *   keywords: ['developer', 'portfolio'],
   *   url: 'https://example.com/about'
   * });
   * ```
   */
  updateTags(config: SeoTagConfig): void {
    // Update page title
    if (config.title) {
      this.titleService.setTitle(config.title);
    }

    // Update or create meta tags
    const tags = this.buildMetaTags(config);
    
    tags.forEach(tag => {
      if (tag.name) {
        this.metaService.updateTag(tag);
      } else if (tag.property) {
        this.metaService.updateTag(tag);
      }
    });
  }

  /**
   * Build array of meta tags from config
   */
  private buildMetaTags(config: SeoTagConfig): Array<{ name?: string; property?: string; content: string }> {
    const tags: Array<{ name?: string; property?: string; content: string }> = [];

    // Standard meta tags
    if (config.description) {
      tags.push({ name: 'description', content: config.description });
    }

    if (config.keywords && config.keywords.length > 0) {
      tags.push({ name: 'keywords', content: config.keywords.join(', ') });
    }

    if (config.author) {
      tags.push({ name: 'author', content: config.author });
    }

    if (config.robots) {
      tags.push({ name: 'robots', content: config.robots });
    }

    // Open Graph tags
    if (config.title) {
      tags.push({ property: 'og:title', content: config.title });
    }

    if (config.description) {
      tags.push({ property: 'og:description', content: config.description });
    }

    if (config.image) {
      tags.push({ property: 'og:image', content: config.image });
    }

    if (config.url) {
      tags.push({ property: 'og:url', content: config.url });
      // Add canonical link
      this.updateCanonicalUrl(config.url);
    }

    if (config.type) {
      tags.push({ property: 'og:type', content: config.type });
    }

    // Twitter Card tags
    if (config.twitterCard) {
      tags.push({ name: 'twitter:card', content: config.twitterCard });
    }

    if (config.twitterSite) {
      tags.push({ name: 'twitter:site', content: config.twitterSite });
    }

    if (config.twitterCreator) {
      tags.push({ name: 'twitter:creator', content: config.twitterCreator });
    }

    if (config.title) {
      tags.push({ name: 'twitter:title', content: config.title });
    }

    if (config.description) {
      tags.push({ name: 'twitter:description', content: config.description });
    }

    if (config.image) {
      tags.push({ name: 'twitter:image', content: config.image });
    }

    return tags;
  }

  /**
   * Update or create canonical URL link tag
   */
  private updateCanonicalUrl(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!link) {
      link = this.renderer.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.renderer.appendChild(this.document.head, link);
    }
    
    link.setAttribute('href', url);
  }

  /**
   * Inject JSON-LD structured data from a URL (e.g., assets file)
   * 
   * @param url URL to JSON-LD schema file
   * @param id Unique identifier for this script tag (optional)
   * 
   * @example
   * ```typescript
   * this.seoService.injectJsonLd('assets/seo/person.schema.json', 'person-schema');
   * ```
   */
  injectJsonLd(url: string, id?: string): void {
    this.http.get<JsonLdSchema>(url).subscribe({
      next: (schema) => {
        this.injectJsonLdSchema(schema, id || url);
      },
      error: (error) => {
        console.error(`Failed to load JSON-LD schema from ${url}:`, error);
      }
    });
  }

  /**
   * Inject JSON-LD structured data directly from an object
   * 
   * @param schema JSON-LD schema object
   * @param id Unique identifier for this script tag
   * 
   * @example
   * ```typescript
   * this.seoService.injectJsonLdSchema({
   *   '@context': 'https://schema.org',
   *   '@type': 'Person',
   *   name: 'John Doe',
   *   jobTitle: 'Software Developer'
   * }, 'person-schema');
   * ```
   */
  injectJsonLdSchema(schema: JsonLdSchema, id: string): void {
    // Remove existing script with same ID if present
    this.removeJsonLdSchema(id);

    // Create new script element
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.id = `jsonld-${id}`;
    script.text = JSON.stringify(schema, null, 2);
    
    // Append to document head
    this.renderer.appendChild(this.document.head, script);
    
    // Store reference for later removal if needed
    this.jsonLdScripts.set(id, script);
  }

  /**
   * Remove a JSON-LD schema by ID
   * 
   * @param id Unique identifier of the schema to remove
   */
  removeJsonLdSchema(id: string): void {
    const existingScript = this.jsonLdScripts.get(id);
    if (existingScript) {
      this.renderer.removeChild(this.document.head, existingScript);
      this.jsonLdScripts.delete(id);
    } else {
      // Try to find and remove by ID in case it exists in DOM
      const script = this.document.getElementById(`jsonld-${id}`);
      if (script) {
        this.renderer.removeChild(this.document.head, script);
      }
    }
  }

  /**
   * Remove all JSON-LD schemas
   */
  removeAllJsonLdSchemas(): void {
    this.jsonLdScripts.forEach((script, id) => {
      this.renderer.removeChild(this.document.head, script);
    });
    this.jsonLdScripts.clear();
  }

  /**
   * Get current page title
   */
  getTitle(): string {
    return this.titleService.getTitle();
  }

  /**
   * Get meta tag content by name
   */
  getMetaTag(name: string): string | null {
    const tag = this.metaService.getTag(`name="${name}"`);
    return tag ? tag.content : null;
  }
}
