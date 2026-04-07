/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories - good for understanding relationships and patterns
 */

function getStatusText(result = "") {
  const text = result.toLowerCase();

  if (text.includes("non-compliant") || text.includes("critical")) {
    return `<span class="status-badge status-bad">${result}</span>`;
  }

  if (text.includes("reopened") || text.includes("completed")) {
    return `<span class="status-badge status-warn">${result}</span>`;
  }

  return `<span class="status-badge status-good">${result}</span>`;
}

function showCategories(data) {
  // Requirements:
  // - Group data by a meaningful category (cuisine, neighborhood, price, etc.)
  // - Show items within each group
  // - Make relationships between groups clear
  // - Consider showing group statistics

  const groupedByCity = data.reduce((groups, item) => {
    const city = item.city || "Unknown";

    if (!groups[city]) {
      groups[city] = [];
    }

    groups[city].push(item);
    return groups;
  }, {});

  const sortedGroups = Object.entries(groupedByCity)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8);

  const groupCards = sortedGroups.map(([city, items]) => {
    const recentItems = [...items]
      .sort((a, b) => {
        const dateA = a.inspection_date ? a.inspection_date.getTime() : 0;
        const dateB = b.inspection_date ? b.inspection_date.getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4);

    return `
      <article class="city-group">
        <h3>${city}</h3>
        <p><span class="label">Inspection records:</span> ${items.length}</p>
        <ul>
          ${recentItems.map((item) => `
            <li>
              <strong>${item.name}</strong><br>
              ${item.inspection_date_display} • ${getStatusText(item.inspection_results)}
            </li>
          `).join("")}
        </ul>
      </article>
    `;
  }).join("");

  return `
    <h2 class="view-title">Category View</h2>
    <p class="view-description">
      This view groups restaurant inspection records by <strong>city</strong>.
      It helps users compare locations, notice where many inspections occur,
      and browse related restaurants together instead of looking at one long list.
    </p>

    <div class="group-grid">
      ${groupCards || `<div class="empty-state">No grouped data available.</div>`}
    </div>

    <h3 class="section-title">Why this view is useful</h3>
    <p class="mini-note">
      Grouping by city makes patterns easier to spot and helps show relationships
      between restaurants in the same area.
    </p>
  `;
}


export default showCategories;