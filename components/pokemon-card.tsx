"use client"

import type React from "react"

import { useState, useOptimistic, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye } from "lucide-react"
import type { Pokemon } from "@/lib/types"
import { formatPokemonName, getPokemonImageUrl } from "@/lib/api"
import { toggleFavorite, isFavorite } from "@/lib/favorites"
import { animateCardEntrance, animateCardHover, animateCardHoverOut } from "@/lib/animations"

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
  const cardRef = useRef<HTMLDivElement>(null)

  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    actualFavorite,
    (state, newState: boolean) => newState,
  )

  useEffect(() => {
    if (cardRef.current) {
      animateCardEntrance(cardRef.current)
    }
  }, [])

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

  const handleMouseEnter = () => {
    animateCardHover(cardRef.current)
  }

  const handleMouseLeave = () => {
    animateCardHoverOut(cardRef.current)
  }

  const imageUrl = imageError ? pokemon.sprites.front_default : getPokemonImageUrl(pokemon.id)

  return (
    <div
      ref={cardRef}
      data-card={true}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group"
    >
      <Card className="backdrop-blur-lg bg-white/8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <CardContent className="p-4">
          <div className="relative">
            {/* Favorite button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/10 hover:bg-white/20 border border-white/20"
              onClick={handleFavoriteClick}
              aria-label={optimisticFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`h-4 w-4 transition-all ${optimisticFavorite ? "fill-pink-500 text-pink-500 scale-110" : "text-white/70"}`}
              />
            </Button>

            {/* Pokemon image */}
            <div className="relative h-48 mb-4 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/10 rounded-xl overflow-hidden border border-white/10">
              {imageUrl ? (
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={`${formatPokemonName(pokemon.name)} artwork`}
                  fill
                  className="object-contain p-2 group-hover:scale-125 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className="flex items-center justify-center h-full text-white/50"
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-white">{formatPokemonName(pokemon.name)}</h3>
                  <span className="text-xs font-mono text-white/50">#{pokemon.id.toString().padStart(3, "0")}</span>
                </div>

                {/* Types */}
                <div className="flex gap-1 flex-wrap" role="list" aria-label="Pokemon types">
                  {pokemon.types.map((type) => (
                    <Badge
                      key={type.type.name}
                      variant="secondary"
                      className={`text-white text-xs font-semibold border-0 ${typeColors[type.type.name] || "bg-gray-600"}`}
                      role="listitem"
                    >
                      {formatPokemonName(type.type.name)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats preview */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white/5 rounded-lg p-2 border border-white/10">
                <div className="flex justify-between">
                  <span className="text-white/60">Height:</span>
                  <span className="text-white font-medium">{(pokemon.height / 10).toFixed(1)}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Weight:</span>
                  <span className="text-white font-medium">{(pokemon.weight / 10).toFixed(1)}kg</span>
                </div>
              </div>

              {/* View details button */}
              <Link href={`/pokemon/${pokemon.id}`} className="block">
                <Button className="w-full bg-gradient-to-r from-blue-500/60 to-purple-500/60 hover:from-blue-500/80 hover:to-purple-500/80 text-white border border-white/20 transition-all duration-300">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
