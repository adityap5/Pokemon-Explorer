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
      <div className="backdrop-blur-lg bg-white/8 border border-white/20 rounded-2xl p-6 shadow-xl animate-slideup">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search Pokémon..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/30"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select value={currentType || "all"} onValueChange={(value) => updateURL({ type: value || undefined })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white min-w-[120px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border-white/20 text-white">
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
              <SelectTrigger className="bg-white/10 border-white/20 text-white min-w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border-white/20 text-white">
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
              className={showingFavorites ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
            >
              <Heart className={`h-4 w-4 mr-2 ${showingFavorites ? "fill-current" : ""}`} />
              Favorites
            </Button>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap p-4 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl animate-slideup">
          <span className="text-xs text-white/60 font-medium uppercase tracking-wide">Active filters:</span>

          {searchValue && (
            <Badge variant="secondary" className="bg-purple-500/30 text-purple-200 border border-purple-400/30">
              Search: {searchValue}
            </Badge>
          )}

          {currentType && currentType !== "all" && (
            <Badge variant="secondary" className="bg-blue-500/30 text-blue-200 border border-blue-400/30">
              Type: {currentType.charAt(0).toUpperCase() + currentType.slice(1)}
            </Badge>
          )}

          {currentSort && currentSort !== "default" && (
            <Badge variant="secondary" className="bg-cyan-500/30 text-cyan-200 border border-cyan-400/30">
              Sort: {currentSort} ({currentOrder})
            </Badge>
          )}

          {showingFavorites && (
            <Badge variant="secondary" className="bg-pink-500/30 text-pink-200 border border-pink-400/30">
              <Heart className="h-3 w-3 mr-1 fill-current" />
              Favorites only
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-white/70 hover:text-white hover:bg-white/10">
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
