# Adding New Containers - Quick Start

This guide shows you how to quickly add new sections/containers to your portfolio using the new flexible grid system.

## Quick Examples

### 1. Add a New Component to Existing Column

**Location:** `src/app/app.html`

Simply add your new component inside any existing `<div class="group-column">`:

```html
<div class="group-column">
  <app-profile-card></app-profile-card>
  <app-about></app-about>
  <app-tech-stack></app-tech-stack>
  
  <!-- ✨ ADD YOUR NEW COMPONENT HERE -->
  <app-my-new-section></app-my-new-section>
</div>
```

### 2. Add a Fourth Column

Add a new column that will automatically adjust responsively:

```html
<main class="cards-container" aria-label="Main content" id="main-content">
  <div class="group-column">
    <app-profile-card></app-profile-card>
    <app-about></app-about>
    <app-tech-stack></app-tech-stack>
  </div>
  <div class="group-column">
    <app-github-activity></app-github-activity>
    <app-experience></app-experience>
    <app-education></app-education>
  </div>
  <div class="group-column">
    <app-stuff></app-stuff>
    <app-hobbies></app-hobbies>
    <app-contact></app-contact>
  </div>
  
  <!-- ✨ ADD YOUR NEW COLUMN HERE -->
  <div class="group-column">
    <app-portfolio></app-portfolio>
    <app-testimonials></app-testimonials>
  </div>
  
  <router-outlet />
</main>
```

**Result:**
- Mobile: Single column (stacked vertically)
- Tablet: 2 columns, wraps to 2 rows
- Desktop: Will show 4 columns or wrap based on screen width

### 3. Add a Full-Width Section

Create a hero banner or full-width section that spans all columns:

```html
<main class="cards-container">
  <!-- ✨ FULL-WIDTH SECTION -->
  <div class="col-12">
    <div class="container">
      <h2>Welcome to My Portfolio</h2>
      <p>Full-width hero section</p>
    </div>
  </div>
  
  <!-- Regular columns below -->
  <div class="group-column">...</div>
  <div class="group-column">...</div>
  <div class="group-column">...</div>
</main>
```

### 4. Create a 2-Column Section

Use the grid utilities to create a specific layout:

```html
<div class="grid grid-12">
  <!-- Main content: 2/3 width on desktop -->
  <div class="col-12 col-lg-8 group-column">
    <app-main-content></app-main-content>
  </div>
  
  <!-- Sidebar: 1/3 width on desktop -->
  <div class="col-12 col-lg-4 group-column">
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

1. **Use `.group-column`** for vertical stacking of related components
2. **Use `.col-*` classes** to control column spans
3. **Test responsively** - the grid adapts to mobile, tablet, and desktop
4. **Keep glassmorphism** - use `.container` class for card styling
