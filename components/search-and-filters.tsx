"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Heart, X } from "lucide-react"
import { fetchPokemonTypes } from "@/lib/api"
import type { PokemonType } from "@/lib/types"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchAndFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [types, setTypes] = useState<PokemonType[]>([])
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "")

  const debouncedSearch = useDebounce(searchValue, 300)

  useEffect(() => {
    fetchPokemonTypes().then(setTypes).catch(console.error)
  }, [])

  useEffect(() => {
    updateURL({ q: debouncedSearch || undefined })
  }, [debouncedSearch])

  const updateURL = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      // Reset to first page when filters change
      if (Object.keys(updates).some((key) => key !== "page")) {
        params.delete("page")
      }

      router.push(`/?${params.toString()}`)
    },
    [searchParams, router],
  )

  const clearFilters = () => {
    setSearchValue("")
    router.push("/")
  }

  const currentType = searchParams.get("type")
  const currentSort = searchParams.get("sort")
  const currentOrder = searchParams.get("order")
  const showingFavorites = searchParams.get("favorites") === "true"

  const hasActiveFilters = searchValue || currentType || currentSort || showingFavorites

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search Pokémon..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={currentType || "all"} onValueChange={(value) => updateURL({ type: value || undefined })}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type.name} value={type.name}>
                  {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentSort ? `${currentSort}-${currentOrder || "asc"}` : "default"}
            onValueChange={(value) => {
              if (!value || value === "default") {
                updateURL({ sort: undefined, order: undefined })
              } else {
                const [sort, order] = value.split("-")
                updateURL({ sort, order })
              }
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="id-asc">ID Low-High</SelectItem>
              <SelectItem value="id-desc">ID High-Low</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showingFavorites ? "default" : "outline"}
            onClick={() => updateURL({ favorites: showingFavorites ? undefined : "true" })}
          >
            <Heart className={`h-4 w-4 mr-2 ${showingFavorites ? "fill-current" : ""}`} />
            Favorites
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {searchValue && <Badge variant="secondary">Search: {searchValue}</Badge>}

          {currentType && currentType !== "all" && (
            <Badge variant="secondary">Type: {currentType.charAt(0).toUpperCase() + currentType.slice(1)}</Badge>
          )}

          {currentSort && currentSort !== "default" && (
            <Badge variant="secondary">
              Sort: {currentSort} ({currentOrder})
            </Badge>
          )}

          {showingFavorites && (
            <Badge variant="secondary">
              <Heart className="h-3 w-3 mr-1 fill-current" />
              Favorites only
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2">
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
