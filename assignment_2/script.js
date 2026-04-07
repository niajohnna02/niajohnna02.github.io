
import showCategories from './editable_js/template_category.js';
import showStats from './editable_js/template_stats.js';
import showTable from './editable_js/template_table.js';
import showExternal from './editable_js/template_external.js';

import loadData from './editable_js/load_data.js';

let mapInstance = null;
let markerLayer = null;
let currentData = [];

// ============================================
// DISPLAY MANAGEMENT - PROVIDED
// ============================================

/**
 * Update the display with new content
 */
function updateDisplay(content) {
  document.getElementById("data-display").innerHTML = content;
}

/**
 * Update button states
 */
function updateButtonStates(activeView) {
  document.querySelectorAll(".view-button").forEach((button) => {
    button.classList.remove("active");
  });
  document.getElementById(`btn-${activeView}`).classList.add("active");
}

/**
 * Show loading state
 */
function showLoading() {
  updateDisplay('<div class="loading">Loading data from API...</div>');
}

/**
 * Show error state
 */
 /*html*/ 
function showError(message) {
  updateDisplay(`
                <div class="error">
                    <h3>Error Loading Data</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()">Try Again</button>
                </div>
            `);
}

// ============================================
// MAP HELPERS
// ============================================

function getStatusClass(result = "") {
  const text = result.toLowerCase();

  if (text.includes("non-compliant") || text.includes("critical")) {
    return "bad";
  }

  if (text.includes("reopened") || text.includes("completed")) {
    return "warn";
  }

  return "other";
}

function buildPopup(item) {
  return `
    <strong>${item.name}</strong><br>
    ${item.address}<br>
    ${item.city}<br><br>
    <strong>Result:</strong> ${item.inspection_results}<br>
    <strong>Date:</strong> ${item.inspection_date_display}
  `;
}

function createMap(data) {
  const mapEl = document.getElementById("map");
  if (!mapEl || !window.L) return;

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  mapInstance = L.map("map").setView([38.88, -76.85], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(mapInstance);

  markerLayer = L.layerGroup().addTo(mapInstance);

  renderMarkers(data);

  const filter = document.getElementById("map-city-filter");
  if (filter) {
    filter.addEventListener("change", () => {
      const selected = filter.value;
      const filtered =
        selected === "all"
          ? data
          : data.filter((item) => item.city === selected);

      renderMarkers(filtered);
    });
  }
}

function renderMarkers(data) {
  if (!markerLayer) return;

  markerLayer.clearLayers();

  data.forEach((item) => {
    if (item.lat === null || item.lng === null) return;

    const status = getStatusClass(item.inspection_results);

    const color =
      status === "bad" ? "#d9534f" :
      status === "warn" ? "#f0ad4e" :
      "#8e7cc3";

    const marker = L.circleMarker([item.lat, item.lng], {
      radius: 6,
      fillColor: color,
      color: "#ffffff",
      weight: 1,
      fillOpacity: 0.9
    });

    marker.bindPopup(buildPopup(item));
    markerLayer.addLayer(marker);
  });
}

// ============================================
// APPLICATION INITIALIZATION - PROVIDED
// ============================================

/**
 * Main application function - handles data loading and button setup
 * This pattern always works - no timing issues!
 */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Starting application...");

  try {
    // Load data once
    showLoading();
    const data = await loadData();
    console.log(`Loaded ${data.length} items from API`);

    // Set up button event handlers - this pattern always works!
    document.getElementById("btn-external").onclick = () => {
      updateDisplay(showExternal(data));
      updateButtonStates("external");
      createMap(currentData);
    };

    document.getElementById("btn-table").onclick = () => {
      updateDisplay(showTable(data));
      updateButtonStates("table");
    };

    document.getElementById("btn-categories").onclick = () => {
      updateDisplay(showCategories(data));
      updateButtonStates("categories");
    };

    document.getElementById("btn-stats").onclick = () => {
      updateDisplay(showStats(data));
      updateButtonStates("stats");
    };

    // Show initial view
    updateDisplay(showExternal(data));
    updateButtonStates("external");

    console.log("Application ready!");
  } catch (error) {
    console.error("Application failed to start:", error);
    showError(error.message);
  }
});
