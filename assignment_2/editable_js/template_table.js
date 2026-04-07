
/**
 * TABLE VIEW
 * Display data in sortable rows - good for scanning specific information
 */

function getStatusBadge(result = "") {
  const text = result.toLowerCase();

  if (text.includes("non-compliant") || text.includes("critical")) {
    return `<span class="status-badge status-bad">${result}</span>`;
  }

  if (text.includes("reopened") || text.includes("completed")) {
    return `<span class="status-badge status-warn">${result}</span>`;
  }

  return `<span class="status-badge status-good">${result}</span>`;
}

function showTable(data) {
  // Requirements:
  // - Show data in a table format
  // - Include all important fields
  // - Make it easy to scan and compare
  // - Consider adding sorting functionality
  //   https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/

    const sortedData = [...data].sort((a, b) => {
    const dateA = a.inspection_date ? a.inspection_date.getTime() : 0;
    const dateB = b.inspection_date ? b.inspection_date.getTime() : 0;
    return dateB - dateA;
  });

  const tableRows = sortedData.slice(0, 75).map((item) => {
    return `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.city}</td>
        <td>${item.address || "N/A"}</td>
        <td>${item.inspection_date_display}</td>
        <td>${item.inspection_type}</td>
        <td>${getStatusBadge(item.inspection_results)}</td>
      </tr>
    `;
  }).join("");

  return `
    <h2 class="view-title">Table View</h2>
    <p class="view-description">
      This table makes it easy to scan restaurant inspection records one by one.
      It is sorted by the newest inspection date first so recent records appear at the top.
    </p>

    <p class="table-caption">
      Showing <strong>${Math.min(data.length, 75)}</strong> of <strong>${data.length}</strong> total records
    </p>

    <div class="restaurant-table-wrapper">
      <table class="restaurant-table">
        <thead>
          <tr>
            <th>Restaurant</th>
            <th>City</th>
            <th>Address</th>
            <th>Inspection Date</th>
            <th>Inspection Type</th>
            <th>Inspection Result</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows || `
            <tr>
              <td colspan="6">
                <div class="empty-state">No restaurant records available.</div>
              </td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

export default showTable;