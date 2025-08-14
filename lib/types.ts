export interface Pokemon {
  id: number
  name: string
  url: string
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  types: Array<{
    type: {
      name: string
      url: string
    }
  }>
  height: number
  weight: number
  base_experience: number
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
      url: string
    }
  }>
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonType {
  id: number
  name: string
}

export interface SearchParams {
  q?: string
  type?: string
  sort?: "name" | "id" | "height" | "weight"
  order?: "asc" | "desc"
  page?: string
  favorites?: "true"
}
