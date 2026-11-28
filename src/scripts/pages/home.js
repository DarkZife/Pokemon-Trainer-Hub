import "../main.js";
import {
  getPokemon,
  getPokemonSpecies,
} from "../api/poke-api.js";

// Starters shown on the home page
const starters = {
  bulbasaur: {},
  charmander: {},
  squirtle: {},
};

const controls = document.querySelector(".starter-controls");

// Update the selected starter and its details
function renderStarter(name) {
  const starter = starters[name];

  for (const key of ["name", "types", "description", "height", "weight"]) {
    document.querySelector(`#partner-${key}`).textContent = starter[key];
  }
  document.querySelector("#partner-number").textContent = `#${String(starter.id).padStart(3, "0")}`;
  const image = document.querySelector("#partner-image");
  image.src = starter.image;
  image.alt = starter.name;
  image.hidden = false;

  for (const option of controls.querySelectorAll("button")) {
    option.setAttribute("aria-pressed", String(option.dataset.pokemon === name));
  }
}

// Switch starters when a button is clicked
controls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-pokemon]");
  if (!button) return;
  renderStarter(button.dataset.pokemon);
});

// Handle missing images
for (const image of document.querySelectorAll(".hero-pokemon, #partner-image")) {
  image.addEventListener("error", () => {
    image.hidden = true;
    document.querySelector("#starter-status").textContent =
      "Some artwork could not load. You can still explore the starter details.";
  });
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Get starter details, descriptions, and images from the API
async function loadStarters() {
  const status = document.querySelector("#starter-status");
  status.textContent = "Loading Pokémon from PokéAPI…";

  try {
    const names = Object.keys(starters);

    const pokemonList = await Promise.all(
      names.map((name) => getPokemon(name))
    );

    const speciesList = await Promise.all(
      pokemonList.map((pokemon) =>
        getPokemonSpecies(pokemon.species.name)
      )
    );

    const images = pokemonList.map((pokemon) => {
      const image =
        pokemon.sprites.other?.["official-artwork"]?.front_default
        || pokemon.sprites.front_default;

      if (!image) {
        throw new Error(`No image is available for ${pokemon.name}.`);
      }

      return image;
    });

    // Prepare the descriptions and measurements for display
    names.forEach((name, index) => {
      const pokemon = pokemonList[index];

      const species = speciesList[index];

      const englishEntry = species.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );

      const description = englishEntry
        ? englishEntry.flavor_text.replace(/\s+/g, " ").trim()
        : "No English description is available.";

      Object.assign(starters[name], {
        id: pokemon.id,
        name: capitalize(pokemon.name),
        description,
        types: pokemon.types.map((entry) => capitalize(entry.type.name)).join(" / "),
        height: `${(pokemon.height / 10).toFixed(1)} m`,
        weight: `${(pokemon.weight / 10).toFixed(1)} kg`,
        image: images[index],
      });

      const heroImage = document.querySelector(
        `.hero-pokemon.${name}`
      );

      heroImage.src = images[index];
      heroImage.hidden = false;
    });

    renderStarter("bulbasaur");
    document.querySelector(".partner-card").hidden = false;
    controls.hidden = false;
    status.textContent = "";
  } catch (error) {
    status.textContent =
      "Could not load Pokémon. Please refresh to try again.";

    console.error("Starter loading failed:", error);
  }
}

loadStarters();
