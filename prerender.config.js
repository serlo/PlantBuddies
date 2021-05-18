require("./data/lang/en/plants");
const en_plants = gPlantDataLang;
require("./data/lang/de/plants");
const de_plants = gPlantDataLang;

let routesArray = ["/", "/🌿", "/de/", "/de/🌿"];

for (var id in en_plants) {
  routesArray.push("/🌿/" + id);
}

for (var id in de_plants) {
  routesArray.push("/de/🌿/" + toSlug(de_plants[id].name));
}

// console.log(" " + routesArray.length + " paths")

module.exports = {
  routes: routesArray,
  rendererConfig: {
    // "headless": false,
    renderAfterDocumentEvent: "prerender-trigger",
    maxConcurrentRoutes: 5,
  },
};

function toSlug(v) {
  v = v.toLowerCase();
  v = v.replace(/\u00e4/g, "ae");
  v = v.replace(/\u00f6/g, "oe");
  v = v.replace(/\u00fc/g, "ue");
  v = v.replace(/\u00df/g, "ss");
  v = v.replace(/ /g, "-");
  v = v.replace(/\./g, "");
  v = v.replace(/,/g, "");
  v = v.replace(/\(/g, "");
  v = v.replace(/\)/g, "");
  v = encodeURIComponent(v);
  return v;
}
