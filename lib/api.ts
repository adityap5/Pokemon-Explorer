import type { Pokemon, PokemonListResponse, PokemonType } from "./types"

const BASE_URL = "https://pokeapi.co/api/v2"

// Cache for API responses
const cache = new Map<string, any>()

export async function fetchPokemonList(offset = 0, limit = 20): Promise<PokemonListResponse> {
  const cacheKey = `pokemon-list-${offset}-${limit}`

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`)

  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon list")
  }

  const data = await response.json()
  cache.set(cacheKey, data)

  return data
}

export async function fetchPokemon(idOrName: string): Promise<Pokemon> {
  const cacheKey = `pokemon-${idOrName}`

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${idOrName}`)
  }

  const data = await response.json()
  cache.set(cacheKey, data)

  return data
}

export async function fetchPokemonByType(typeName: string): Promise<any> {
  const cacheKey = `pokemon-type-${typeName}`

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const response = await fetch(`${BASE_URL}/type/${typeName}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon by type: ${typeName}`)
  }

  const data = await response.json()
  cache.set(cacheKey, data)

  return data
}

export async function fetchPokemonTypes(): Promise<PokemonType[]> {
  const cacheKey = "pokemon-types"

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const response = await fetch(`${BASE_URL}/type`)

  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon types")
  }

  const data = await response.json()
  const types = data.results.map((type: any, index: number) => ({
    id: index + 1,
    name: type.name,
  }))

  cache.set(cacheKey, types)
  return types
}

export function getPokemonIdFromUrl(url: string): number {
  const matches = url.match(/\/pokemon\/(\d+)\//)
  return matches ? Number.parseInt(matches[1]) : 0
}

export function formatPokemonName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function getPokemonImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}
