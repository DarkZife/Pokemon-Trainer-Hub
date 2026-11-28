const pokeAPI_URL = "https://pokeapi.co/api/v2";

export async function getPokemon(nameOrId) {
    const identifier = String(nameOrId).trim().toLowerCase();

    if (!identifier) {
        throw new Error("Invalid Pokémon name or ID.");
    }

    const response = await fetch(`${pokeAPI_URL}/pokemon/${encodeURIComponent(identifier)}/`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Pokémon with name or ID "${identifier}" not found.`);
        }

        throw new Error(`Failed to fetch Pokémon data. (${response.status}).`);
    }

    return await response.json();
}

// Get species data for the Pokédex descriptions.
export async function getPokemonSpecies(nameOrId) {
  const identifier = String(nameOrId ?? "").trim().toLowerCase();

  if (!identifier) {
    throw new Error("Enter a Pokémon species name or ID.");
  }

  const response = await fetch(
    `${pokeAPI_URL}/pokemon-species/${encodeURIComponent(identifier)}/`
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load Pokémon species (${response.status}).`
    );
  }

  return response.json();
}

// Get the Pokémon species introduced in a generation.
export async function getGeneration(id) {
  const response = await fetch(
    `${pokeAPI_URL}/generation/${encodeURIComponent(id)}/`
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load generation (${response.status}).`
    );
  }

  return response.json();
}