import "../main.js";
import {
  getGeneration,
  getPokemon,
} from "../api/poke-api.js";

// Page elements and batch settings
const regionsContainer = document.querySelector("#pokedex-regions");
const status = document.querySelector("#pokedex-status");
const BATCH_SIZE = 24;
const GENERATION_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Format names for the cards
function formatName(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Build the image, number, and name for each card
function createPokemonCard(pokemon) {
  const card = document.createElement("li");
  card.className = "pokemon-card";

  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default
    || pokemon.sprites.front_default;

  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = "";
    image.width = 120;
    image.height = 120;
    image.loading = "lazy";

    image.addEventListener("error", () => {
      image.hidden = true;
    });

    card.append(image);
  }

  const number = document.createElement("p");
  number.className = "pokemon-number";
  number.textContent = `#${String(pokemon.id).padStart(4, "0")}`;

  const name = document.createElement("h3");
  name.className = "pokemon-name";
  name.textContent = formatName(pokemon.name);

  card.append(number, name);

  return card;
}

// Load another batch and update the count or show a retry message
async function loadNextBatch(regionState) {

    if(regionState.isLoading || regionState.nextIndex >= regionState.species.length) {
        return;
    }

    regionState.isLoading = true;
    regionState.loadingMessage.textContent = "Loading more Pokémon";
    regionState.retryButton.hidden = true;

    try{

        const firstBatch = regionState.species.slice(
            regionState.nextIndex,
            regionState.nextIndex + BATCH_SIZE
        );

        
        const pokemonList = await Promise.all(
        firstBatch.map((entry) => getPokemon(entry.id))
        );

        for (const pokemon of pokemonList) {
        regionState.grid.append(createPokemonCard(pokemon));
        }

        regionState.nextIndex += firstBatch.length;
        regionState.count.textContent =
          `${regionState.nextIndex} of ${regionState.species.length} displayed`;

        regionState.loadingMessage.textContent = "";

    }catch (error){

        regionState.loadingMessage.textContent = "Could not load Pokémon. Select Try again to retry.";
        regionState.retryButton.hidden = false;

        throw error;

    } finally {
        regionState.isLoading = false;
    }

}

// Set up each region from the generation data
async function loadRegion(generationId) {
  status.textContent = `Loading generation ${generationId} Pokémon…`;

  try {
    const generation = await getGeneration(generationId);
    const regionName = generation.main_region.name;
    status.textContent = `Loading ${formatName(regionName)} Pokémon…`;

    const species = generation.pokemon_species.map((entry) => {
      const urlParts = entry.url.split("/").filter(Boolean);

      return {
        name: entry.name,
        id: Number(urlParts.at(-1)),
      };
    });

    species.sort((a, b) => a.id - b.id);

    const section = document.createElement("section");
    section.className = "pokedex-region";
    section.id = `region-${regionName}`;
    section.setAttribute("aria-labelledby", `heading-${regionName}`);

    const heading = document.createElement("div");
    heading.className = "region-heading";

    const title = document.createElement("h2");
    title.id = `heading-${regionName}`;
    title.textContent = formatName(regionName);

    const count = document.createElement("p");
    count.className = "region-count";
    count.textContent = `0 of ${species.length} displayed`;

    heading.append(title, count);

    const grid = document.createElement("ul");
    grid.className = "pokemon-grid";
    
    // Scroll marker, loading message, and retry button
    const sentinel = document.createElement("div");
    sentinel.className = "scroll-sentinel";
    sentinel.setAttribute("aria-hidden", "true");

    const loadingMessage = document.createElement("p");
    loadingMessage.className = "region-status";
    loadingMessage.setAttribute("role", "status");
    loadingMessage.textContent = "";

    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.className = "retry-button";
    retryButton.textContent = "Try again";
    retryButton.hidden = true;

    // Save the progress and page elements for this region
    const regionState = {
      species,
      nextIndex: 0,
      isLoading: false,
      grid,
      loadingMessage,
      retryButton,
      count,
      sentinel,
    };

    section.append(heading, grid, loadingMessage, retryButton, sentinel);
    regionsContainer.append(section);

    // Handle loading and retries, then resume scrolling after success
    async function requestNextBatch() {
      if (regionState.isLoading || regionState.nextIndex >= species.length) {
        return;
      }

      observer.unobserve(sentinel);

      try {
        await loadNextBatch(regionState);

        if (regionState.nextIndex < species.length) {
          observer.observe(sentinel);
        }
      } catch (error) {
        console.error("Batch loading failed:", error);
      }
    }

    // Load more when the bottom of the cards gets close to the screen
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            requestNextBatch();
          }
        }
      },
      {
        rootMargin: "0px 0px 200px 0px",
      }
    );

    // Connect the retry button before loading the first batch
    retryButton.addEventListener("click", requestNextBatch);

    await requestNextBatch();

    return true;
  } catch (error) {
    console.error(`Generation ${generationId} loading failed:`, error);
    return false;
  }
}

// Load the first batch for each region in order; scrolling loads the rest
async function loadPokedex() {
  regionsContainer.replaceChildren();
  const failedGenerations = [];

  for (const generationId of GENERATION_IDS) {
    const loaded = await loadRegion(generationId);
    if (!loaded) failedGenerations.push(generationId);
  }

  status.textContent = failedGenerations.length
    ? `Could not load generations ${failedGenerations.join(", ")}. Please refresh to try again.`
    : "";
}

loadPokedex();
