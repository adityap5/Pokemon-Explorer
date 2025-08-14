# Pokémon Resource Explorer

A modern, responsive web application for exploring Pokémon data with advanced search, filtering, and favorites functionality. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Browse Pokémon**: Paginated list view with detailed Pokémon cards
- **Advanced Search**: Real-time search with debouncing across Pokémon names
- **Smart Filtering**: Filter by Pokémon type with dedicated API endpoints
- **Flexible Sorting**: Sort by name (A-Z, Z-A) or Pokédex ID (ascending/descending)
- **Favorites System**: Add/remove favorites with localStorage persistence
- **Detailed Views**: Individual Pokémon pages with stats, abilities, and characteristics
- **Theme Toggle**: Light/dark mode with persistent user preference
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Optimistic UI**: Instant feedback for favorite toggles with proper error handling

## How to Run

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation & Setup

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd pokemon-resource-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Architecture & Trade-offs

### Technology Stack

- **Next.js 14**: App Router for modern React development with built-in optimizations
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first styling with consistent design system
- **shadcn/ui**: High-quality, accessible component library
- **PokéAPI**: RESTful API for comprehensive Pokémon data

### Key Architectural Decisions

#### 1. API Integration Strategy
**Decision**: Hybrid approach using different PokéAPI endpoints based on filter state
- **No filters**: Paginated `/pokemon` endpoint (20 per page)
- **Type filter**: Dedicated `/type/{id}` endpoint for complete type-specific data
- **Search**: Bulk fetch (200+ Pokémon) for comprehensive search results

**Trade-offs**:
- ✅ **Pros**: Optimal performance for each use case, accurate filtering results
- ❌ **Cons**: More complex logic, different loading patterns per filter type
- **Alternative considered**: Single large dataset fetch - rejected due to performance impact

#### 2. State Management
**Decision**: URL-first state management with React hooks
- Search parameters stored in URL for shareability and browser navigation
- Local component state for UI interactions
- localStorage for user preferences (favorites, theme)

**Trade-offs**:
- ✅ **Pros**: Shareable URLs, browser back/forward support, no external dependencies
- ❌ **Cons**: More complex URL parsing logic, potential URL pollution
- **Alternative considered**: Context API - rejected to avoid prop drilling and over-engineering

#### 3. Caching Strategy
**Decision**: Simple in-memory caching with Map-based storage
- Individual Pokémon details cached indefinitely
- Type-specific results cached per type
- No cache invalidation (acceptable for static Pokémon data)

**Trade-offs**:
- ✅ **Pros**: Fast subsequent loads, simple implementation, no external dependencies
- ❌ **Cons**: Memory usage grows over time, no persistence across sessions
- **Alternative considered**: React Query - rejected to minimize bundle size for this scope

#### 4. Search Implementation
**Decision**: Client-side search with debounced input (300ms delay)
- Fetch larger dataset when search is active
- Filter results client-side for instant feedback
- Reset to paginated mode when search is cleared

**Trade-offs**:
- ✅ **Pros**: Instant search results, good UX with debouncing
- ❌ **Cons**: Larger initial data fetch when searching, limited to subset of all Pokémon
- **Alternative considered**: Server-side search - not available in PokéAPI

#### 5. Favorites System
**Decision**: localStorage with optimistic UI updates
- Immediate UI feedback using React's `useOptimistic`
- Wrapped in `startTransition` for proper React 18+ compatibility
- Fallback to actual state if localStorage operations fail

**Trade-offs**:
- ✅ **Pros**: Instant feedback, works offline, persists across sessions
- ❌ **Cons**: Limited to single device, potential sync issues
- **Alternative considered**: Server-side favorites - rejected due to no authentication requirement

#### 6. Component Architecture
**Decision**: Composition-based component design
- Small, focused components with single responsibilities
- Custom hooks for reusable logic (debouncing, favorites)
- Prop drilling minimized through strategic component boundaries

**Trade-offs**:
- ✅ **Pros**: Highly reusable, easy to test, clear separation of concerns
- ❌ **Cons**: More files to manage, potential over-abstraction
- **Alternative considered**: Larger components - rejected for maintainability

### Performance Optimizations

1. **Request Cancellation**: AbortController prevents race conditions
2. **Debounced Search**: Reduces API calls during typing
3. **Optimistic Updates**: Immediate UI feedback for favorites
4. **Image Optimization**: Next.js automatic image optimization
5. **Code Splitting**: Automatic route-based splitting via Next.js

### Accessibility Features

- Semantic HTML structure with proper headings
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly content
- High contrast color schemes in both themes
- Focus management for modal interactions

### Known Limitations

1. **Search Scope**: Limited to ~200 Pokémon for performance reasons
2. **Offline Support**: No service worker implementation
3. **Image Loading**: Dependent on external PokéAPI image URLs
4. **Mobile Gestures**: No swipe navigation implemented
5. **Infinite Scroll**: Uses traditional pagination instead

### Future Enhancements

- Virtual scrolling for large datasets
- Advanced filtering (generation, stats ranges)
- Pokémon comparison feature
- Team builder functionality
- Progressive Web App (PWA) capabilities
- Server-side rendering for better SEO

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── pokemon/[id]/      # Dynamic Pokémon detail pages
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Home page with Pokémon list
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── pokemon-*.tsx     # Pokémon-specific components
│   ├── search-and-filters.tsx
│   └── theme-*.tsx       # Theme-related components
├── lib/                  # Utility functions and API
│   ├── api.ts           # PokéAPI integration
│   ├── types.ts         # TypeScript type definitions
│   ├── utils.ts         # General utilities
│   └── favorites.ts     # Favorites management
└── hooks/               # Custom React hooks
    └── use-debounce.ts  # Debouncing utility
```

## API Reference

The application uses the [PokéAPI](https://pokeapi.co/) for all Pokémon data:

- **Pokémon List**: `https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`
- **Pokémon Details**: `https://pokeapi.co/api/v2/pokemon/{id}`
- **Type Filtering**: `https://pokeapi.co/api/v2/type/{type-name}`
- **All Types**: `https://pokeapi.co/api/v2/type`

No API key required - PokéAPI is free and open source.
