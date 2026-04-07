// ============================================
// DATA LOADING
// ============================================

function toSmartTitleCase(str = "") {
  const alwaysUpper = new Set(["DC", "MD", "VA", "UMCP", "USA", "LLC", "IHOP", "TGI"]);

  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (!word) return "";

      // keep standalone ampersand clean
      if (word === "&") return "&";

      // handle hyphenated words like non-compliant or lanham-seabrook
      const hyphenParts = word.split("-").map((part) => {
        if (!part) return "";

        const upperVersion = part.toUpperCase();
        if (alwaysUpper.has(upperVersion)) return upperVersion;

        return part.charAt(0).toUpperCase() + part.slice(1);
      });

      const rebuilt = hyphenParts.join("-");

      const upperVersion = rebuilt.toUpperCase();
      if (alwaysUpper.has(upperVersion)) return upperVersion;

      return rebuilt;
    })
    .join(" ")
    // clean spacing around &
    .replace(/\s*&\s*/g, " & ")
    // remove extra spaces
    .replace(/\s+/g, " ")
    .trim();
}

async function loadData() {
  try {
    const response = await fetch("./data.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const rawData = await response.json();
    console.log("raw data loaded", rawData);

    const features = rawData.features || [];

    const cleanedData = features.map((feature) => {
      const props = feature.properties || {};
      const coords = feature.geometry?.coordinates || [null, null];

      const inspectionDate = props.inspection_date
        ? new Date(props.inspection_date)
        : null;

      return {
        id: props.establishment_id || props[":id"] || crypto.randomUUID(),
        name: toSmartTitleCase(props.name || "Unknown Restaurant"),
        category: toSmartTitleCase(props.category || "Unknown"),
        city: toSmartTitleCase(props.city || "Unknown"),
        state: props.state || "MD",
        zip: props.zip || "N/A",
        address: toSmartTitleCase([props.address_line_1, props.address_line_2]
          .filter((part) => part && part !== "------")
          .join(", ")),
        inspection_date: inspectionDate,
        inspection_date_display: inspectionDate
          ? inspectionDate.toLocaleDateString()
          : "Unknown",
        inspection_results: props.inspection_results || "Unknown",
        inspection_type: toSmartTitleCase(props.inspection_type || "Unknown"),
        owner: toSmartTitleCase(props.owner || "Unknown"),
        proper_hand_washing: props.proper_hand_washing || "Unknown",
        adequate_hand_washing: props.adequate_hand_washing || "Unknown",
        rodent_and_insects: props.rodent_and_insects || "Unknown",
        food_contact_surfaces_and: props.food_contact_surfaces_and || "Unknown",
        cold_holding_temperature: props.cold_holding_temperature || "Unknown",
        lat: typeof coords[1] === "number" ? coords[1] : null,
        lng: typeof coords[0] === "number" ? coords[0] : null
      };
    });

    return cleanedData;
  } catch (error) {
    console.error("Failed to load data:", error);
    throw new Error("Could not load restaurant inspection data.");
  }
}

export default loadData;