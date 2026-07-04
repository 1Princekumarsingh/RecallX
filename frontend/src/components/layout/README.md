# Layout Components

This directory contains responsive layout components for the RecallX application.

## Components

### `Container`

Responsive container with consistent padding and max-width constraints.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content to render inside container |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | Maximum width constraint |
| `className` | `string` | `''` | Additional CSS classes |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | HTML element to render as |

**Size Mapping:**
- `sm`: 640px max-width
- `md`: 768px max-width
- `lg`: 1024px max-width (default)
- `xl`: 1280px max-width
- `full`: No max-width constraint

**Responsive Padding:**
- Mobile: 16px horizontal padding (`px-4`)
- Tablet: 24px horizontal padding (`md:px-6`)
- Desktop: 32px horizontal padding (`lg:px-8`)

**Features:**
- Prevents horizontal scrolling (`overflow-x-hidden`)
- Centered with `mx-auto`
- Full width within constraints

**Examples:**

```tsx
import { Container } from '@/components/layout'

// Basic usage - default lg container
function Page() {
  return (
    <Container>
      <h1>Page Title</h1>
      <p>Content goes here...</p>
    </Container>
  )
}

// Custom size with additional classes
function WidePage() {
  return (
    <Container size="xl" className="py-8">
      <h1>Wide Layout</h1>
      <div>Extra wide content...</div>
    </Container>
  )
}

// Full width container
function FullWidthHero() {
  return (
    <Container size="full" className="bg-blue-500 text-white">
      <h1>Hero Section</h1>
    </Container>
  )
}

// Custom element (section instead of div)
function ArticleSection() {
  return (
    <Container as="section" size="md">
      <article>Article content...</article>
    </Container>
  )
}
```

---

### `ResponsiveGrid`

Adaptive grid layout that changes columns based on viewport size.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Grid items |
| `columns` | `{ mobile?: 1, tablet?: 1\|2, desktop?: 1\|2\|3\|4 }` | `{ mobile: 1, tablet: 2, desktop: 3 }` | Columns per breakpoint |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Gap size between items |
| `className` | `string` | `''` | Additional CSS classes |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | HTML element to render as |

**Gap Mapping:**
- `sm`: 16px (`gap-4`)
- `md`: 24px (`gap-6`) - default
- `lg`: 32px (`gap-8`)

**Default Column Configuration:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Examples:**

```tsx
import { ResponsiveGrid } from '@/components/layout'

// Basic usage - 1-2-3 column grid
function SubjectsList() {
  return (
    <ResponsiveGrid>
      <SubjectCard subject={subject1} />
      <SubjectCard subject={subject2} />
      <SubjectCard subject={subject3} />
    </ResponsiveGrid>
  )
}

// Custom column configuration
function ChapterGrid() {
  return (
    <ResponsiveGrid 
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      gap="lg"
    >
      {chapters.map(chapter => (
        <ChapterCard key={chapter.id} chapter={chapter} />
      ))}
    </ResponsiveGrid>
  )
}

// Single column layout (good for forms)
function FormLayout() {
  return (
    <ResponsiveGrid columns={{ mobile: 1, tablet: 1, desktop: 1 }}>
      <FormField name="name" />
      <FormField name="email" />
      <FormField name="password" />
    </ResponsiveGrid>
  )
}

// Dense grid for small items
function TagGrid() {
  return (
    <ResponsiveGrid 
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      gap="sm"
    >
      {tags.map(tag => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </ResponsiveGrid>
  )
}

// Custom element (section)
function GallerySection() {
  return (
    <ResponsiveGrid as="section" gap="lg">
      {images.map(img => (
        <img key={img.id} src={img.url} alt={img.alt} />
      ))}
    </ResponsiveGrid>
  )
}
```

---

## Common Usage Patterns

### Page Layout with Container and Grid

```tsx
import { Container, ResponsiveGrid } from '@/components/layout'

function SubjectsPage() {
  return (
    <Container size="lg">
      <h1 className="text-2xl font-bold mb-6">My Subjects</h1>
      
      <ResponsiveGrid>
        {subjects.map(subject => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </ResponsiveGrid>
    </Container>
  )
}
```

### Nested Grids

```tsx
function Dashboard() {
  return (
    <Container>
      {/* Stats in 2-column grid on tablet, 4-column on desktop */}
      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
        <StatCard title="Total Questions" value={250} />
        <StatCard title="Mastered" value={120} />
        <StatCard title="In Review" value={80} />
        <StatCard title="New" value={50} />
      </ResponsiveGrid>

      <h2 className="text-xl font-semibold mt-8 mb-4">Recent Activity</h2>
      
      {/* Activity cards in standard 1-2-3 layout */}
      <ResponsiveGrid>
        <ActivityCard activity={activity1} />
        <ActivityCard activity={activity2} />
        <ActivityCard activity={activity3} />
      </ResponsiveGrid>
    </Container>
  )
}
```

### Sidebar Layout

```tsx
import { Container } from '@/components/layout'
import { useBreakpoint } from '@/hooks'

function ContentWithSidebar() {
  const breakpoint = useBreakpoint()
  const showSidebar = breakpoint !== 'mobile'

  return (
    <Container size="xl">
      <div className="flex flex-col lg:flex-row gap-6">
        <main className="flex-1">
          <h1>Main Content</h1>
          <p>Content goes here...</p>
        </main>
        
        {showSidebar && (
          <aside className="lg:w-64">
            <h2>Sidebar</h2>
            <nav>Navigation items...</nav>
          </aside>
        )}
      </div>
    </Container>
  )
}
```

### Full-Width Section with Contained Content

```tsx
function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
      <Container size="lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to RecallX</h1>
        <p className="text-xl mb-8">Master your subjects with spaced repetition</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg">
          Get Started
        </button>
      </Container>
    </section>
  )
}
```

## Breakpoint Reference

These components work seamlessly with TailwindCSS breakpoints:

| Breakpoint | Min Width | Prefix | Description |
|------------|-----------|--------|-------------|
| Mobile | 0px | (none) | Default mobile-first styles |
| Tablet | 768px | `md:` | Tablet and above |
| Desktop | 1024px | `lg:` | Desktop and above |
| Wide | 1280px | `xl:` | Wide desktop displays |

**Example with Tailwind classes:**
```tsx
<Container className="
  text-sm md:text-base lg:text-lg
  px-4 md:px-6 lg:px-8
">
  Text scales up on larger screens
</Container>
```

## Accessibility

Both components follow accessibility best practices:

- **Semantic HTML**: Use the `as` prop to render semantic elements (`section`, `article`, `main`, etc.)
- **Focus Management**: Grid items maintain proper tab order
- **Screen Readers**: Content reflows naturally for screen readers
- **Keyboard Navigation**: No special keyboard handling needed

## Performance

- **CSS Grid**: Uses native CSS Grid for optimal performance
- **No JavaScript calculations**: All responsive behavior handled by CSS
- **Minimal re-renders**: Components only re-render when props change
- **Efficient classes**: TailwindCSS purges unused classes in production

## Testing

Both components have comprehensive test coverage:

- Unit tests for all props
- Responsive class application
- Custom className support
- Custom element rendering
- Default value handling

Run tests:
```bash
npm run test -- Container.test.tsx
npm run test -- ResponsiveGrid.test.tsx
```

## Requirements Validation

These layout components satisfy:

- **Requirement 1.1**: Responsive layout system
- **Requirement 1.2**: Enhanced navigation and menu system
- **Requirement 1.3**: Card component enhancement with responsive grids
- **Requirement 1.7**: Prevents horizontal scrolling
- **Requirement 1.8**: Consistent spacing and layout patterns
- **Requirement 3.6**: Card arrangement in responsive grid (1-2-3+ columns)
- **Requirement 14.5**: Statistics cards in responsive grid
