---
title: Demo Sequence Flow
purpose: Step-by-step Epic 3 demonstration showing self-editing application in action
audience: Implementation agents, video demo planning
when_to_read: Building Epic 3, planning conversational demo flow
key_sections: [Product Catalog Evolution, Flow Diagram, Key Demonstration Points]
status: active
---

# Demo Sequence Flow - Epic 3

---

## Product Catalog Evolution

This is the sequence we'll demonstrate in the browser text box.

### Step 1: Empty State

```
┌─────────────────────┐
│  [Text box]         │
│  [Empty]            │
└─────────────────────┘
```

---

### Step 2: Create Initial Data

**User types**: "Add 3 products"

```
┌─────────────────────┐
│  [Text box]         │
│  "Added 3 products" │
└─────────────────────┘
```

**File created**: `data/products.json` ✅

---

### Step 3: Generate Listing Page

**User types**: "Generate listing page"

```
┌─────────────────────┐
│  [Product List]     │
│  • Product 1        │
│  • Product 2        │
│  • Product 3        │
└─────────────────────┘
```

**File created**: `products.html` ✅

---

### Step 4: Discover Missing Detail Pages

**User clicks product** → 404 error

---

### Step 5: Request Detail Pages

**User types**: "Generate detail pages"

```
┌─────────────────────┐
│  [Text box]         │
│  "Creating detail   │
│   page template"    │
└─────────────────────┘
```

**Files created**: `product-*.html` ✅

---

### Step 6: Detail Pages Now Work

```
┌─────────────────────┐
│  Product 1 Detail   │
│  [Full info]        │
│  [Back to list]     │
└─────────────────────┘
```

User clicks product → sees detail page ✅

---

### Step 7: Enhance Data Structure

**User types**: "Add 15 more products with tags"

**File updated**: `data/products.json` (now 18 items, with tags) ✅

---

### Step 8: Update Listing to Show Tags

**User types**: "Update listing to show tags"

```
┌─────────────────────┐
│  [Product List]     │
│  • Product 1 #new   │
│  • Product 2 #sale  │
│  • Product 3 #top   │
│  ... (18 total)     │
└─────────────────────┘
```

**File updated**: `products.html` (regenerated with tags) ✅

---

### Step 9: Create Landing Page

**User types**: "Create homepage with 3 featured products"

```
┌─────────────────────┐
│  [Hero Section]     │
│  ┌───┐ ┌───┐ ┌───┐  │
│  │ 1 │ │ 2 │ │ 3 │  │
│  └───┘ └───┘ └───┘  │
│  Featured Products  │
└─────────────────────┘
```

**File created/updated**: `index.html` ✅

---

## Flow Diagram

```
Start (empty app)
      ↓
Add 3 products → data/products.json created
      ↓
Generate listing → products.html created
      ↓
Click product → 404 (discovery moment)
      ↓
Generate details → product-*.html created
      ↓
Click product → Detail page works! ✅
      ↓
Add 15 more + tags → data updated (18 products)
      ↓
Update listing UI → products.html regenerated
      ↓
Create homepage → index.html with featured items
      ↓
End (fully functional product catalog built conversationally)
```

---

## Key Demonstration Points

1. **Progressive Discovery**: User discovers missing features (404) and fixes them conversationally
2. **Data Evolution**: Data structure expands (simple products → products with tags)
3. **UI Regeneration**: Listing page regenerates to reflect new data structure
4. **Self-Editing**: Application modifies itself based on conversation
5. **No Code Written**: Everything happens through text box (no VSCode, no BMAD at this point)

---

## Optional: Add Blog System

After the product catalog is working:

**User types**: "Create blog system: 5 posts with title, date, author, content"

- Creates `data/blog.json`
- User types: "Generate blog list and detail pages"
- Creates `public/blog.html`, `public/blog-detail.html`
- User types: "Update landing to include latest 2 blog posts below products"
- Updates `index.html` to pull from both data sources

---

## Notes

- This is **Epic 3** - no BMAD, pure conversational development
- Shows the power of Claude SDK's self-modification capability
- Each step builds on the previous
- Natural discovery flow (404 → fix)
- Demonstrates data-driven UI regeneration
