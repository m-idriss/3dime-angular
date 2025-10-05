# Grid System Examples

> Practical examples for using the flexible grid system in 3dime-angular portfolio.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Adding New Containers](#adding-new-containers)
- [Custom Layouts](#custom-layouts)
- [Responsive Column Spans](#responsive-column-spans)
- [Common Patterns](#common-patterns)

---

## Basic Usage

The portfolio uses a responsive CSS Grid system that automatically adapts to different screen sizes:

- **Mobile (< 768px)**: Single column layout
- **Tablet (≥ 768px)**: Two column layout
- **Desktop (≥ 1024px)**: Three column layout

### Default 3-Column Layout

This is the current layout structure:

```html
<main class="cards-container">
  <!-- Column 1 -->
  <div class="group-column">
    <app-profile-card></app-profile-card>
    <app-about></app-about>
    <app-tech-stack></app-tech-stack>
  </div>
  
  <!-- Column 2 -->
  <div class="group-column">
    <app-github-activity></app-github-activity>
    <app-experience></app-experience>
    <app-education></app-education>
  </div>
  
  <!-- Column 3 -->
  <div class="group-column">
    <app-stuff></app-stuff>
    <app-hobbies></app-hobbies>
    <app-contact></app-contact>
  </div>
</main>
```

---

## Adding New Containers

### Example 1: Adding a New Component to Existing Column

Simply add your new component inside any `group-column`:

```html
<div class="group-column">
  <app-profile-card></app-profile-card>
  <app-about></app-about>
  <app-tech-stack></app-tech-stack>
  <!-- NEW: Add your new component -->
  <app-my-new-section></app-my-new-section>
</div>
```

### Example 2: Adding a Fourth Column

Add a new `group-column` to create a fourth column (will adjust responsively):

```html
<main class="cards-container">
  <div class="group-column">...</div>
  <div class="group-column">...</div>
  <div class="group-column">...</div>
  
  <!-- NEW: Fourth column -->
  <div class="group-column">
    <app-portfolio></app-portfolio>
    <app-testimonials></app-testimonials>
  </div>
</main>
```

On desktop (1024px+), the grid will automatically adjust to show all 4 columns, or wrap to multiple rows.

### Example 3: Full-Width Section

Create a section that spans all columns:

```html
<main class="cards-container">
  <!-- Full-width header section -->
  <div class="col-12">
    <app-hero-banner></app-hero-banner>
  </div>
  
  <!-- Regular columns -->
  <div class="group-column">...</div>
  <div class="group-column">...</div>
  <div class="group-column">...</div>
</main>
```

---

## Custom Layouts

### Example 4: 2-1 Layout (Two Columns + One Wide)

Create a custom grid with different column widths:

```html
<div class="grid grid-12">
  <!-- Takes 4 columns on desktop -->
  <div class="col-12 col-lg-4 group-column">
    <app-profile-card></app-profile-card>
    <app-about></app-about>
  </div>
  
  <!-- Takes 4 columns on desktop -->
  <div class="col-12 col-lg-4 group-column">
    <app-experience></app-experience>
    <app-education></app-education>
  </div>
  
  <!-- Takes 4 columns on desktop -->
  <div class="col-12 col-lg-4 group-column">
    <app-contact></app-contact>
  </div>
</div>
```

### Example 5: Asymmetric Layout

```html
<div class="grid grid-12">
  <!-- Small sidebar: 1/4 width on desktop -->
  <div class="col-12 col-lg-3 group-column">
    <app-profile-card></app-profile-card>
    <app-contact></app-contact>
  </div>
  
  <!-- Main content: 3/4 width on desktop -->
  <div class="col-12 col-lg-9 group-column">
    <app-about></app-about>
    <app-experience></app-experience>
    <app-tech-stack></app-tech-stack>
  </div>
</div>
```

### Example 6: Auto-Responsive Grid

Let the grid automatically fit items based on available space:

```html
<div class="grid grid-auto-fit">
  <div class="container">
    <h2>Project 1</h2>
    <p>Description...</p>
  </div>
  
  <div class="container">
    <h2>Project 2</h2>
    <p>Description...</p>
  </div>
  
  <div class="container">
    <h2>Project 3</h2>
    <p>Description...</p>
  </div>
  
  <!-- Add more items - they'll automatically fit -->
  <div class="container">
    <h2>Project 4</h2>
    <p>Description...</p>
  </div>
</div>
```

---

## Responsive Column Spans

### Example 7: Different Layouts per Screen Size

```html
<div class="grid grid-12">
  <!-- Full width on mobile, half on tablet, third on desktop -->
  <div class="col-12 col-md-6 col-lg-4 group-column">
    <app-profile-card></app-profile-card>
  </div>
  
  <!-- Full width on mobile, half on tablet, third on desktop -->
  <div class="col-12 col-md-6 col-lg-4 group-column">
    <app-about></app-about>
  </div>
  
  <!-- Full width on mobile and tablet, third on desktop -->
  <div class="col-12 col-md-12 col-lg-4 group-column">
    <app-contact></app-contact>
  </div>
</div>
```

### Example 8: Featured Section

```html
<div class="grid grid-12">
  <!-- Featured content: Full width on mobile, 2/3 on desktop -->
  <div class="col-12 col-lg-8">
    <app-featured-project></app-featured-project>
  </div>
  
  <!-- Sidebar: Full width on mobile, 1/3 on desktop -->
  <div class="col-12 col-lg-4 group-column">
    <app-quick-links></app-quick-links>
    <app-social-feed></app-social-feed>
  </div>
</div>
```

---

## Common Patterns

### Pattern 1: Gallery Grid

```html
<section class="container">
  <h2>My Gallery</h2>
  
  <div class="grid grid-auto-fit">
    <img src="image1.jpg" alt="Gallery item 1" class="container">
    <img src="image2.jpg" alt="Gallery item 2" class="container">
    <img src="image3.jpg" alt="Gallery item 3" class="container">
    <img src="image4.jpg" alt="Gallery item 4" class="container">
  </div>
</section>
```

### Pattern 2: Card Grid with Fixed Columns

```html
<div class="grid grid-3">
  <article class="container">
    <h3>Feature 1</h3>
    <p>Description...</p>
  </article>
  
  <article class="container">
    <h3>Feature 2</h3>
    <p>Description...</p>
  </article>
  
  <article class="container">
    <h3>Feature 3</h3>
    <p>Description...</p>
  </article>
</div>
```

### Pattern 3: Mixed Content Layout

```html
<div class="grid grid-12">
  <!-- Hero section spanning full width -->
  <header class="col-12">
    <app-page-hero></app-page-hero>
  </header>
  
  <!-- Two-column content -->
  <article class="col-12 col-lg-8">
    <app-main-content></app-main-content>
  </article>
  
  <aside class="col-12 col-lg-4">
    <app-sidebar></app-sidebar>
  </aside>
  
  <!-- Footer spanning full width -->
  <footer class="col-12">
    <app-page-footer></app-page-footer>
  </footer>
</div>
```

---

## Tips & Best Practices

### 1. Keep Components in Columns
For consistent spacing and alignment, wrap related components in `group-column`:

```html
<div class="group-column">
  <app-component-1></app-component-1>
  <app-component-2></app-component-2>
</div>
```

### 2. Use Semantic Column Spans
Choose column spans that make sense for your content:

- **`col-12`**: Full width sections, headers, footers
- **`col-6`**: Two equal columns side by side
- **`col-4`**: Three equal columns
- **`col-8 + col-4`**: Main content + sidebar

### 3. Test Responsiveness
Always check how your layout looks on different screen sizes:

- **Mobile**: Single column (stacked)
- **Tablet**: 2 columns
- **Desktop**: 3+ columns

### 4. Maintain Visual Balance
Try to keep similar amounts of content in each column for visual balance.

### 5. Use Auto-Fit for Dynamic Content
When you don't know how many items you'll have, use `grid-auto-fit`:

```html
<div class="grid grid-auto-fit">
  <!-- Items will automatically arrange themselves -->
</div>
```

---

## Migration Guide

### Converting from Flexbox to Grid

**Old (Flexbox):**
```html
<div style="display: flex; flex-direction: column;">
  <app-component></app-component>
</div>
```

**New (Grid):**
```html
<div class="group-column">
  <app-component></app-component>
</div>
```

### Adding Flexibility

The new grid system makes it easy to reorganize your layout without changing component code:

```html
<!-- Before: Fixed 3-column layout with flexbox -->
<main class="cards-container" style="display: flex;">
  <div style="flex: 1;">...</div>
  <div style="flex: 1;">...</div>
  <div style="flex: 1;">...</div>
</main>

<!-- After: Flexible grid with responsive breakpoints -->
<main class="cards-container">
  <div class="group-column">...</div>
  <div class="group-column">...</div>
  <div class="group-column">...</div>
  <!-- Easy to add more! -->
  <div class="group-column">...</div>
</main>
```

---

## Additional Resources

- [CSS Grid Layout Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Design System Documentation](./DESIGN_SYSTEM.md)
- [Responsive Design Best Practices](./DESIGN_SYSTEM.md#responsive-design)
