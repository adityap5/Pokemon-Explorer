"use client"

import type React from "react"

import { useState, useOptimistic } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye } from "lucide-react"
import type { Pokemon } from "@/lib/types"
import { formatPokemonName, getPokemonImageUrl } from "@/lib/api"
import { toggleFavorite, isFavorite } from "@/lib/favorites"

interface PokemonCardProps {
  pokemon: Pokemon & { id: number }
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [imageError, setImageError] = useState(false)
  const [actualFavorite, setActualFavorite] = useState(() => isFavorite(pokemon.id))

  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    actualFavorite,
    (state, newState: boolean) => newState,
  )

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Optimistically update UI
    const newFavState = !optimisticFavorite
    setOptimisticFavorite(newFavState)

    // Perform actual update
    const actualNewState = toggleFavorite(pokemon.id)
    setActualFavorite(actualNewState)
  }

  const imageUrl = imageError ? pokemon.sprites.front_default : getPokemonImageUrl(pokemon.id)

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="relative">
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 z-10 h-8 w-8 p-0 hover:bg-background/80"
            onClick={handleFavoriteClick}
            aria-label={optimisticFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${optimisticFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
            />
          </Button>

          {/* Pokemon image */}
          <div className="relative h-48 mb-4 bg-gradient-to-br from-muted/50 to-muted rounded-lg overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={`${formatPokemonName(pokemon.name)} artwork`}
                fill
                className="object-contain p-2 group-hover:scale-110 transition-transform duration-200"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="flex items-center justify-center h-full text-muted-foreground"
                role="img"
                aria-label="Pokemon image not available"
              >
                <div className="text-4xl">❓</div>
              </div>
            )}
          </div>

          {/* Pokemon info */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-lg">{formatPokemonName(pokemon.name)}</h3>
                <span className="text-sm text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</span>
              </div>

              {/* Types */}
              <div className="flex gap-1 flex-wrap" role="list" aria-label="Pokemon types">
                {pokemon.types.map((type) => (
                  <Badge
                    key={type.type.name}
                    variant="secondary"
                    className={`text-white text-xs ${typeColors[type.type.name] || "bg-gray-400"}`}
                    role="listitem"
                  >
                    {formatPokemonName(type.type.name)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats preview */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Height:</span>
                <span>{(pokemon.height / 10).toFixed(1)}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight:</span>
                <span>{(pokemon.weight / 10).toFixed(1)}kg</span>
              </div>
            </div>

            {/* View details button */}
            <Link href={`/pokemon/${pokemon.id}`} className="block">
              <Button className="w-full bg-transparent" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
