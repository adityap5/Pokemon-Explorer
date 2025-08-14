const FAVORITES_KEY = "pokemon-favorites"

export function getFavorites(): number[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addToFavorites(pokemonId: number): void {
  if (typeof window === "undefined") return

  const favorites = getFavorites()
  if (!favorites.includes(pokemonId)) {
    const updated = [...favorites, pokemonId]
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  }
}

export function removeFromFavorites(pokemonId: number): void {
  if (typeof window === "undefined") return

  const favorites = getFavorites()
  const updated = favorites.filter((id) => id !== pokemonId)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
}

export function isFavorite(pokemonId: number): boolean {
  return getFavorites().includes(pokemonId)
}

export function toggleFavorite(pokemonId: number): boolean {
  const isCurrentlyFavorite = isFavorite(pokemonId)

  if (isCurrentlyFavorite) {
    removeFromFavorites(pokemonId)
    return false
  } else {
    addToFavorites(pokemonId)
    return true
  }
}
