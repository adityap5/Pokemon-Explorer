import { Suspense } from "react"
import { PokemonList } from "@/components/pokemon-list"
import { SearchAndFilters } from "@/components/search-and-filters"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FloatingPokemonBackground } from "@/components/floating-pokemon"


export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <FloatingPokemonBackground />
      
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-b from-white/10 via-white/5 to-transparent border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Pokémon Explorer</h1>
              <p className="text-sm text-white/70">Discover, search, and favorite your favorite Pokémon</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="space-y-8">
          <Suspense fallback={<ListSkeleton />}>
            <SearchAndFilters />
            <PokemonList />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="p-4">
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </Card>
      ))}
    </div>
  )
}
