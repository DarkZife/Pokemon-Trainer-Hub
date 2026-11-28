const tcgDEX_URL = "https://api.tcgdex.net/v2/en";

// Get one trading card by its card ID.
export async function getCard(cardId) {
  const identifier = String(cardId ?? "").trim();

  if (!identifier) {
    throw new Error("Enter a card ID.");
  }

  const response = await fetch(
    `${tcgDEX_URL}/cards/${encodeURIComponent(identifier)}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`No card found for "${identifier}".`);
    }

    throw new Error(`Unable to load card (${response.status}).`);
  }

  return response.json();
}