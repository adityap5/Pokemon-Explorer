"use client"

import { useState, useOptimistic, startTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Heart, Share2 } from "lucide-react"
import type { Pokemon } from "@/lib/types"
import { formatPokemonName, getPokemonImageUrl } from "@/lib/api"
import { toggleFavorite, isFavorite } from "@/lib/favorites"

interface PokemonDetailProps {
  pokemon: Pokemon
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

const statNames: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
}

export function PokemonDetail({ pokemon }: PokemonDetailProps) {
  const [imageError, setImageError] = useState(false)
  const [actualFavorite, setActualFavorite] = useState(() => isFavorite(pokemon.id))

  // Optimistically update UI
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    actualFavorite,
    (state, newState: boolean) => newState,
  )

  const handleFavoriteClick = () => {
    startTransition(() => {
      const newFavState = !optimisticFavorite
      setOptimisticFavorite(newFavState)
    })

    // Perform actual update
    const actualNewState = toggleFavorite(pokemon.id)
    setActualFavorite(actualNewState)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${formatPokemonName(pokemon.name)} - Pokémon Explorer`,
          text: `Check out ${formatPokemonName(pokemon.name)} on Pokémon Explorer!`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        // You could add a toast notification here
      } catch (error) {
        console.error("Failed to copy URL:", error)
      }
    }
  }

  const imageUrl = imageError ? pokemon.sprites.front_default : getPokemonImageUrl(pokemon.id)
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  const maxStat = Math.max(...pokemon.stats.map((stat) => stat.base_stat))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{formatPokemonName(pokemon.name)}</h1>
            <p className="text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} aria-label="Share this Pokemon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant={optimisticFavorite ? "default" : "outline"}
            size="sm"
            onClick={handleFavoriteClick}
            aria-label={optimisticFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`mr-2 h-4 w-4 transition-colors ${optimisticFavorite ? "fill-current" : ""}`} />
            {optimisticFavorite ? "Favorited" : "Add to Favorites"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image and basic info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative h-80 mb-6 bg-gradient-to-br from-muted/50 to-muted rounded-lg overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`${formatPokemonName(pokemon.name)} official artwork`}
                    fill
                    className="object-contain p-4"
                    onError={() => setImageError(true)}
                    priority
                  />
                ) : (
                  <div
                    className="flex items-center justify-center h-full text-muted-foreground"
                    role="img"
                    aria-label="Pokemon image not available"
                  >
                    <div className="text-6xl">❓</div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="flex justify-center gap-2 mb-4" role="list" aria-label="Pokemon types">
                  {pokemon.types.map((type) => (
                    <Badge
                      key={type.type.name}
                      className={`text-white ${typeColors[type.type.name] || "bg-gray-400"}`}
                      role="listitem"
                    >
                      {formatPokemonName(type.type.name)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical characteristics */}
          <Card>
            <CardHeader>
              <CardTitle>Physical Characteristics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold" aria-label={`Height: ${(pokemon.height / 10).toFixed(1)} meters`}>
                    {(pokemon.height / 10).toFixed(1)}m
                  </div>
                  <div className="text-sm text-muted-foreground">Height</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div
                    className="text-2xl font-bold"
                    aria-label={`Weight: ${(pokemon.weight / 10).toFixed(1)} kilograms`}
                  >
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </div>
                  <div className="text-sm text-muted-foreground">Weight</div>
                </div>
              </div>

              {pokemon.base_experience && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold" aria-label={`Base experience: ${pokemon.base_experience} points`}>
                    {pokemon.base_experience}
                  </div>
                  <div className="text-sm text-muted-foreground">Base Experience</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats and abilities */}
        <div className="space-y-6">
          {/* Base Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Base Stats</CardTitle>
              <p className="text-sm text-muted-foreground">Total: {totalStats}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {statNames[stat.stat.name] || formatPokemonName(stat.stat.name)}
                    </span>
                    <span className="text-sm font-bold">{stat.base_stat}</span>
                  </div>
                  <Progress
                    value={(stat.base_stat / maxStat) * 100}
                    className="h-2"
                    aria-label={`${statNames[stat.stat.name] || formatPokemonName(stat.stat.name)}: ${stat.base_stat} out of ${maxStat}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Abilities */}
          <Card>
            <CardHeader>
              <CardTitle>Abilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" role="list" aria-label="Pokemon abilities">
                {pokemon.abilities.map((ability, index) => (
                  <div
                    key={`${ability.ability.name}-${index}`}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    role="listitem"
                  >
                    <span className="font-medium">{formatPokemonName(ability.ability.name)}</span>
                    {ability.is_hidden && (
                      <Badge variant="secondary" className="text-xs">
                        Hidden
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Type effectiveness could be added here */}
          <Card>
            <CardHeader>
              <CardTitle>Type Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" role="list" aria-label="Pokemon type information">
                {pokemon.types.map((type, index) => (
                  <div
                    key={`${type.type.name}-${index}`}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    role="listitem"
                  >
                    <Badge className={`text-white ${typeColors[type.type.name] || "bg-gray-400"}`}>
                      {formatPokemonName(type.type.name)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Slot {index + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
