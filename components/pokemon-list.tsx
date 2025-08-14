"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { PokemonCard } from "./pokemon-card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { fetchPokemonList, fetchPokemon, getPokemonIdFromUrl, fetchPokemonByType } from "@/lib/api"
import type { Pokemon, PokemonListItem, SearchParams } from "@/lib/types"
import { getFavorites } from "@/lib/favorites"

interface PokemonWithId extends Pokemon {
  id: number
}

export function PokemonList() {
  const searchParams = useSearchParams()
  const [pokemon, setPokemon] = useState<PokemonWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const abortControllerRef = useRef<AbortController | null>(null)

  const ITEMS_PER_PAGE = 20

  const getSearchParamsObject = (): SearchParams => {
    return {
      q: searchParams.get("q") || undefined,
      type: searchParams.get("type") || undefined,
      sort: (searchParams.get("sort") as "name" | "id" | "height" | "weight") || undefined,
      order: (searchParams.get("order") as "asc" | "desc") || undefined,
      page: searchParams.get("page") || undefined,
      favorites: searchParams.get("favorites") || undefined,
    }
  }

  const loadPokemon = useCallback(
    async (page = 1, append = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const newAbortController = new AbortController()
      abortControllerRef.current = newAbortController

      try {
        setLoading(true)
        setError(null)

        const params = getSearchParamsObject()

        if (params.favorites === "true") {
          const favoriteIds = getFavorites()
          if (favoriteIds.length === 0) {
            setPokemon([])
            setHasMore(false)
            setLoading(false)
            return
          }

          const favoritePromises = favoriteIds.map((id) => fetchPokemon(id.toString()).catch(() => null))
          const favoritePokemon = (await Promise.all(favoritePromises))
            .filter((p): p is Pokemon => p !== null)
            .map((p) => ({ ...p, id: p.id }))

          let filteredPokemon = favoritePokemon

          // Apply search filter
          if (params.q) {
            filteredPokemon = filteredPokemon.filter((p) => p.name.toLowerCase().includes(params.q!.toLowerCase()))
          }

          // Apply type filter
          if (params.type && params.type !== "all") {
            filteredPokemon = filteredPokemon.filter((p) => p.types.some((t) => t.type.name === params.type))
          }

          // Apply sorting
          if (params.sort) {
            filteredPokemon = sortPokemon(filteredPokemon, params.sort, params.order)
          }

          setPokemon(filteredPokemon)
          setHasMore(false)
          setLoading(false)
          return
        }

        if (params.type && params.type !== "all") {
          const typeData = await fetchPokemonByType(params.type)

          if (newAbortController.signal.aborted) return

          // Get Pokemon details for the type
          const pokemonPromises = typeData.pokemon.map(async (item: any) => {
            const id = getPokemonIdFromUrl(item.pokemon.url)
            try {
              const pokemonData = await fetchPokemon(id.toString())
              return { ...pokemonData, id }
            } catch {
              return null
            }
          })

          let allTypePokemon = (await Promise.all(pokemonPromises)).filter((p): p is PokemonWithId => p !== null)

          if (newAbortController.signal.aborted) return

          // Apply search filter
          if (params.q) {
            allTypePokemon = allTypePokemon.filter((p) => p.name.toLowerCase().includes(params.q!.toLowerCase()))
          }

          // Apply sorting
          if (params.sort) {
            allTypePokemon = sortPokemon(allTypePokemon, params.sort, params.order)
          }

          // Handle pagination for filtered results
          const startIndex = (page - 1) * ITEMS_PER_PAGE
          const endIndex = startIndex + ITEMS_PER_PAGE
          const paginatedPokemon = allTypePokemon.slice(startIndex, endIndex)

          if (append) {
            setPokemon((prev) => [...prev, ...paginatedPokemon])
          } else {
            setPokemon(paginatedPokemon)
          }

          setHasMore(endIndex < allTypePokemon.length)
          setCurrentPage(page)
          setLoading(false)
          return
        }

        if (params.q) {
          // For search, we need to fetch more Pokemon to get better results
          const searchLimit = Math.max(200, page * ITEMS_PER_PAGE * 2) // Fetch more for better search results
          const listResponse = await fetchPokemonList(0, searchLimit)

          if (newAbortController.signal.aborted) return

          const pokemonPromises = listResponse.results.map(async (item: PokemonListItem) => {
            const id = getPokemonIdFromUrl(item.url)
            try {
              const pokemonData = await fetchPokemon(id.toString())
              return { ...pokemonData, id }
            } catch {
              return null
            }
          })

          let allPokemon = (await Promise.all(pokemonPromises)).filter((p): p is PokemonWithId => p !== null)

          if (newAbortController.signal.aborted) return

          // Apply search filter
          allPokemon = allPokemon.filter((p) => p.name.toLowerCase().includes(params.q!.toLowerCase()))

          // Apply sorting
          if (params.sort) {
            allPokemon = sortPokemon(allPokemon, params.sort, params.order)
          }

          // Handle pagination for search results
          const startIndex = (page - 1) * ITEMS_PER_PAGE
          const endIndex = startIndex + ITEMS_PER_PAGE
          const paginatedPokemon = allPokemon.slice(startIndex, endIndex)

          if (append) {
            setPokemon((prev) => [...prev, ...paginatedPokemon])
          } else {
            setPokemon(paginatedPokemon)
          }

          setHasMore(endIndex < allPokemon.length)
          setCurrentPage(page)
          setLoading(false)
          return
        }

        const offset = (page - 1) * ITEMS_PER_PAGE
        const listResponse = await fetchPokemonList(offset, ITEMS_PER_PAGE)

        if (newAbortController.signal.aborted) return

        const pokemonPromises = listResponse.results.map(async (item: PokemonListItem) => {
          const id = getPokemonIdFromUrl(item.url)
          try {
            const pokemonData = await fetchPokemon(id.toString())
            return { ...pokemonData, id }
          } catch {
            return null
          }
        })

        let pokemonDetails = (await Promise.all(pokemonPromises)).filter((p): p is PokemonWithId => p !== null)

        if (newAbortController.signal.aborted) return

        // Apply sorting
        if (params.sort) {
          pokemonDetails = sortPokemon(pokemonDetails, params.sort, params.order)
        }

        if (append) {
          setPokemon((prev) => [...prev, ...pokemonDetails])
        } else {
          setPokemon(pokemonDetails)
        }

        setHasMore(!!listResponse.next)
        setCurrentPage(page)
      } catch (err) {
        if (newAbortController.signal.aborted) return

        setError(err instanceof Error ? err.message : "Failed to load Pokemon")
      } finally {
        if (!newAbortController.signal.aborted) {
          setLoading(false)
        }
      }
    },
    [], // Removed dependencies to prevent infinite loop
  )

  const sortPokemon = (pokemonList: PokemonWithId[], sort: string, order?: string): PokemonWithId[] => {
    return pokemonList.sort((a, b) => {
      let aVal: any, bVal: any

      switch (sort) {
        case "name":
          aVal = a.name
          bVal = b.name
          break
        case "id":
          aVal = a.id
          bVal = b.id
          break
        case "height":
          aVal = a.height
          bVal = b.height
          break
        case "weight":
          aVal = a.weight
          bVal = b.weight
          break
        default:
          return 0
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return order === "desc" ? -result : result
    })
  }

  useEffect(() => {
    const page = Number.parseInt(searchParams.get("page") || "1")
    setCurrentPage(page)
    loadPokemon(page, false)
  }, [
    searchParams.get("q"),
    searchParams.get("type"),
    searchParams.get("sort"),
    searchParams.get("order"),
    searchParams.get("page"),
    searchParams.get("favorites"),
    loadPokemon,
  ])

  const loadMore = () => {
    loadPokemon(currentPage + 1, true)
  }

  const retry = () => {
    loadPokemon(currentPage, false)
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={retry}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (loading && pokemon.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
            <div className="bg-muted h-48 w-full rounded mb-4" />
            <div className="bg-muted h-6 w-3/4 rounded mb-2" />
            <div className="bg-muted h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (pokemon.length === 0) {
    const params = getSearchParamsObject()
    const isFiltered = params.q || params.type || params.favorites === "true"

    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">{isFiltered ? "No Pokemon found" : "No Pokemon available"}</h3>
        <p className="text-muted-foreground">
          {isFiltered
            ? "Try adjusting your search or filters to find what you're looking for."
            : "There are no Pokemon to display at the moment."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={loadMore} disabled={loading} variant="outline" size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
