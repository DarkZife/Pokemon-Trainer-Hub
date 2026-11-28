import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa",

  // Pages to include when building the site.
  input: {
    home: resolve(import.meta.dirname, "index.html"),
    pokedex: resolve(import.meta.dirname, "pages/pokedex.html"),
    pokemonDetails: resolve(
      import.meta.dirname,
      "pages/pokemon-details.html"
    ),
    cards: resolve(import.meta.dirname, "pages/cards.html"),
    cardDetails: resolve(import.meta.dirname, "pages/card-details.html"),
    collection: resolve(import.meta.dirname, "pages/collection.html"),
    packs: resolve(import.meta.dirname, "pages/packs.html"),
  },
});