
/**
 * EXTERNAL LIBRARY VIEW
 * Pick an external library and pipe your data to it.
 */

function getUniqueCities(data) {
  return [...new Set(data.map(item => item.city).filter(Boolean))].sort();
}

function showExternal(data) {
  const cities = getUniqueCities(data);

  return `
    <h2 class="view-title">External Library View</h2>
    <p class="view-description">
      This view uses <strong>Leaflet.js</strong> to display restaurant inspection data on a map.
      It helps users understand geographic patterns and explore where inspections occur
      across Prince George’s County.
    </p>

    <div class="map-shell">
      <div class="filters">
        <div class="filter-group">
          <label for="map-city-filter">Filter by city</label>
          <select id="map-city-filter">
            <option value="all">All cities</option>
            ${cities.map(city => `<option value="${city}">${city}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="legend">
        <span><i class="legend-dot dot-bad"></i> Critical / Non-Compliant</span>
        <span><i class="legend-dot dot-other"></i> Other results</span>
      </div>

      <div id="map"></div>
    </div>
  `;
}

export default showExternal;