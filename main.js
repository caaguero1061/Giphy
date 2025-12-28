const GIPHY_API_KEY = "PASTE_YOUR_KEY_HERE";

// DOM
const formEl = document.getElementById("searchForm");
const inputEl = document.getElementById("searchInput");
const resultsEl = document.getElementById("results");
const statusEl = document.getElementById("statusText");

// Helpers
function setStatus(message) {
  statusEl.textContent = message;
}

function clearResults() {
  resultsEl.innerHTML = "";
}

function renderGifCard({ url, alt }) {
  const card = document.createElement("div");
  card.className = "gif-card";

  const img = document.createElement("img");
  img.className = "gif-img";
  img.src = url;
  img.alt = alt;

  card.appendChild(img);
  resultsEl.appendChild(card);
}

async function searchGifs(query) {
  // Basic safety/cleanup
  const cleaned = query.trim();
  if (!cleaned) return;

  const limit = 24;

  // Giphy Search Endpoint
  const endpoint =
    "https://api.giphy.com/v1/gifs/search" +
    `?api_key=${encodeURIComponent(GIPHY_API_KEY)}` +
    `&q=${encodeURIComponent(cleaned)}` +
    `&limit=${limit}&rating=g&lang=en`;

  setStatus("Loading GIFs...");
  clearResults();

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    const data = await res.json();

    const gifs = data?.data ?? [];
    if (gifs.length === 0) {
      setStatus(`No results found for "${cleaned}". Try another search.`);
      return;
    }

    setStatus(`Showing ${gifs.length} results for "${cleaned}".`);

    // ✅ Iterate through returned array, find an image in each JSON object, append to screen
    gifs.forEach((gif) => {
      // Choose a reasonable image size for grid
      const url = gif?.images?.fixed_width?.url || gif?.images?.original?.url;
      const alt = gif?.title || "Giphy result";
      if (url) renderGifCard({ url, alt });
    });
  } catch (err) {
    console.error(err);
    setStatus("Something went wrong. Please try again.");
  }
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  searchGifs(inputEl.value);
});