import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../shared/seo';

/**
 * Example component demonstrating SEO service usage
 * 
 * This component shows how to:
 * 1. Update SEO tags when a component initializes
 * 2. Set page-specific metadata
 * 3. Inject JSON-LD structured data
 * 4. Clean up schemas when component is destroyed
 */
@Component({
  selector: 'app-seo-example',
  standalone: true,
  template: `
    <article>
      <h1>SEO Example Component</h1>
      <p>
        This component demonstrates how to use the SEO service to manage
        page-specific metadata, Open Graph tags, and JSON-LD structured data.
      </p>
      
      <section>
        <h2>Current SEO Tags</h2>
        <dl>
          <dt>Title:</dt>
          <dd>{{ currentTitle }}</dd>
          
          <dt>Description:</dt>
          <dd>{{ currentDescription }}</dd>
        </dl>
      </section>
    </article>
  `,
  styles: [`
    article {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    section {
      margin-top: 2rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }
    
    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem 1rem;
    }
    
    dt {
      font-weight: bold;
    }
  `]
})
export class SeoExampleComponent implements OnInit {
  currentTitle = '';
  currentDescription = '';

  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    // Update page-specific SEO tags
    this.seoService.updateTags({
      title: 'SEO Example – 3dime Portfolio',
      description: 'Demonstration of the SEO service for managing meta tags and structured data in Angular.',
      keywords: ['SEO', 'Angular', 'Meta Tags', 'Open Graph', 'JSON-LD'],
      url: 'https://3dime.com/seo-example',
      type: 'article',
      twitterCard: 'summary',
      robots: 'index, follow'
    });

    // Inject an example JSON-LD schema
    this.seoService.injectJsonLdSchema({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'SEO Example Component',
      description: 'Example demonstrating SEO service usage',
      author: {
        '@type': 'Person',
        name: '3dime'
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString()
    }, 'seo-example-article');

    // Get current values to display
    this.currentTitle = this.seoService.getTitle();
    this.currentDescription = this.seoService.getMetaTag('description') || '';
  }

  ngOnDestroy(): void {
    // Clean up component-specific JSON-LD schema when leaving the page
    this.seoService.removeJsonLdSchema('seo-example-article');
  }
}
