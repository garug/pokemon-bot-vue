import axios from "axios";

interface PokemonFilters {
  userId?: string;
  name?: string;
  limit?: number;
}

export async function getPokemon(filters: PokemonFilters) {
  return axios.get(`${process.env.VUE_APP_BACKEND_URL}/pokemon`, {
    params: { ...filters },
  });
}
