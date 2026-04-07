/**
 * STATS VIEW
 * Show aggregate statistics and insights - good for understanding the big picture
 */

function percent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function topCities(data, count = 5) {
  const counts = {};

  data.forEach((item) => {
    const city = item.city || "Unknown";
    counts[city] = (counts[city] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);
}

function showStats(data) {
  // Requirements:
  // Replace the below "task" description with the following:
  // - One meaningful statistic calculation from the supplied dataset
  // ===- percent of restaurants not passing hand-washing, for example
  // - Present insights visually
  // - Show distributions, averages, counts, etc.
  // - Help users understand patterns in the data
  
  const total = data.length;

  const criticalOrNonCompliant = data.filter((item) => {
    const result = (item.inspection_results || "").toLowerCase();
    return result.includes("critical") || result.includes("non-compliant");
  }).length;

  const handWashingIssues = data.filter((item) =>
    item.proper_hand_washing === "Out of Compliance" ||
    item.adequate_hand_washing === "Out of Compliance"
  ).length;

  const rodentIssues = data.filter((item) =>
    item.rodent_and_insects === "Out of Compliance"
  ).length;

  const surfaceIssues = data.filter((item) =>
    item.food_contact_surfaces_and === "Out of Compliance"
  ).length;

  const temperatureIssues = data.filter((item) =>
    item.cold_holding_temperature === "Out of Compliance"
  ).length;

  const recentYear = data.filter((item) => {
    if (!item.inspection_date) return false;
    return item.inspection_date.getFullYear() >= 2023;
  }).length;

  const topCityList = topCities(data, 6);

  return `
    <h2 class="view-title">Stats View</h2>
    <p class="view-description">
      This view summarizes the dataset so users can quickly understand overall
      restaurant inspection patterns instead of focusing on one business at a time.
    </p>

    <div class="stats-grid">
      <article class="stat-card">
        <h3>Total Records</h3>
        <p class="big-number">${total}</p>
      </article>

      <article class="stat-card">
        <h3>Critical or Non-Compliant Results</h3>
        <p class="big-number">${percent(criticalOrNonCompliant, total)}%</p>
        <p>${criticalOrNonCompliant} records</p>
      </article>

      <article class="stat-card">
        <h3>Hand-Washing Issues</h3>
        <p class="big-number">${percent(handWashingIssues, total)}%</p>
        <p>${handWashingIssues} records</p>
      </article>

      <article class="stat-card">
        <h3>Rodent/Insect Issues</h3>
        <p class="big-number">${percent(rodentIssues, total)}%</p>
        <p>${rodentIssues} records</p>
      </article>

      <article class="stat-card">
        <h3>Surface Sanitation Issues</h3>
        <p class="big-number">${percent(surfaceIssues, total)}%</p>
        <p>${surfaceIssues} records</p>
      </article>

      <article class="stat-card">
        <h3>Cold Holding Temperature Issues</h3>
        <p class="big-number">${percent(temperatureIssues, total)}%</p>
        <p>${temperatureIssues} records</p>
      </article>

      <article class="stat-card">
        <h3>Inspections From 2023 or Later</h3>
        <p class="big-number">${percent(recentYear, total)}%</p>
        <p>${recentYear} records</p>
      </article>
    </div>

    <h3 class="section-title">Top cities in the dataset</h3>
    <div class="bar-list">
      ${topCityList.map(([city, count]) => `
        <div class="bar-row">
          <div class="bar-label">
            <span>${city}</span>
            <span>${count}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${percent(count, topCityList[0][1])}%"></div>
          </div>
        </div>
      `).join("")}
    </div>
  `;

}

export default showStats