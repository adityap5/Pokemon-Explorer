import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PokemonDetail } from "@/components/pokemon-detail"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPokemon } from "@/lib/api"

interface PokemonPageProps {
  params: {
    id: string
  }
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { id } = params

  // Validate ID
  if (!id || (!/^\d+$/.test(id) && !/^[a-z-]+$/.test(id))) {
    notFound()
  }

  try {
    const pokemon = await fetchPokemon(id)

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<DetailSkeleton />}>
            <PokemonDetail pokemon={pokemon} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}

function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image section skeleton */}
        <Card className="p-6">
          <Skeleton className="h-80 w-full mb-4" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </Card>

        {/* Info section skeleton */}
        <div className="space-y-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>

          <Card className="p-6">
            <Skeleton className="h-6 w-16 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-2 w-32" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
