# Adding New Containers - Quick Start

This guide shows you how to quickly add new sections/containers to your portfolio using the flexible CSS Grid system.

## Quick Examples

### 1. Add a New Component

**Location:** `src/app/app.html`

Simply add your new component directly to the grid container:

```html
<main class="cards-container" aria-label="Main content" id="main-content">
  <app-profile-card></app-profile-card>
  <app-about></app-about>
  <app-tech-stack></app-tech-stack>
  <app-github-activity></app-github-activity>
  <app-experience></app-experience>
  <app-education></app-education>
  <app-stuff></app-stuff>
  <app-hobbies></app-hobbies>
  <app-contact></app-contact>
  
  <!-- ✨ ADD YOUR NEW COMPONENT HERE -->
  <app-my-new-section></app-my-new-section>
  
  <router-outlet />
</main>
```

**Result:**
- Components flow naturally in the grid
- Mobile: Single column (stacked vertically)
- Tablet: 2 columns with automatic flow
- Desktop: 3 columns with automatic flow

### 2. Add Multiple Components

The grid automatically arranges components based on screen size:

### 2. Add Multiple Components

The grid automatically arranges components based on screen size:

```html
<main class="cards-container" aria-label="Main content" id="main-content">
  <app-profile-card></app-profile-card>
  <app-about></app-about>
  <app-tech-stack></app-tech-stack>
  <app-github-activity></app-github-activity>
  <app-experience></app-experience>
  <app-education></app-education>
  <app-stuff></app-stuff>
  <app-hobbies></app-hobbies>
  <app-contact></app-contact>
  
  <!-- ✨ ADD MORE COMPONENTS -->
  <app-portfolio></app-portfolio>
  <app-testimonials></app-testimonials>
  <app-blog></app-blog>
  
  <router-outlet />
</main>
```

**Result:**
- Mobile: All items in 1 column
- Tablet: 2 columns, items fill top-to-bottom then left-to-right
- Desktop: 3 columns, items fill top-to-bottom then left-to-right

### 3. Add a Full-Width Section

Use column span utilities for custom layouts:

```html
<main class="cards-container">
  <!-- ✨ FULL-WIDTH SECTION -->
  <div class="col-12">
    <div class="container">
      <h2>Welcome to My Portfolio</h2>
      <p>Full-width hero section</p>
    </div>
  </div>
  
  <!-- Regular components -->
  <app-profile-card></app-profile-card>
  <app-about></app-about>
  <app-tech-stack></app-tech-stack>
</main>
```

### 4. Create a Custom 2-Column Section

Use the `.grid` utility for complete control:

```html
<div class="grid grid-12">
  <!-- Main content: 2/3 width on desktop -->
  <div class="col-12 col-lg-8">
    <app-main-content></app-main-content>
  </div>
  
  <!-- Sidebar: 1/3 width on desktop -->
  <div class="col-12 col-lg-4">
    <app-sidebar></app-sidebar>
  </div>
</div>
```

## No Code Changes Needed!

The beauty of the new grid system is that you can:

✅ **Add new components** without modifying CSS  
✅ **Reorder sections** by moving HTML elements  
✅ **Create custom layouts** using utility classes  
✅ **Maintain responsive behavior** automatically  

## Resources

- Full documentation: [docs/DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md#grid-system)
- More examples: [docs/GRID_EXAMPLES.md](./GRID_EXAMPLES.md)
- Component examples: See existing components in `src/app/components/`

## Tips

1. **Add components directly** to `.cards-container` - no wrapper divs needed
2. **Use `.col-*` classes** to control column spans when needed
3. **Test responsively** - the grid adapts to mobile, tablet, and desktop automatically
4. **Keep glassmorphism** - use `.container` class for card styling
