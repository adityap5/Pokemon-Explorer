import { Suspense } from "react"
import { PokemonList } from "@/components/pokemon-list"
import { SearchAndFilters } from "@/components/search-and-filters"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pokémon Explorer</h1>
              <p className="text-muted-foreground mt-2">Discover, search, and favorite your favorite Pokémon</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">

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
