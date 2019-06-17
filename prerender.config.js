
require('./data/lang/en/plants');
const en_plants = gPlantDataLang
require('./data/lang/de/plants');
const de_plants = gPlantDataLang

let routesArray = ["/", "/🌿", "/de/", "/de/🌿"]

for (var id in en_plants) {
  routesArray.push('/🌿/' + id)
}

for (var id in de_plants) {
  routesArray.push('/de/🌿/' + id)
}

console.log(" " + routesArray.length + " paths")

module.exports = {
  "routes": routesArray,
  "rendererConfig": {
    // "headless": false,
    "renderAfterDocumentEvent": "prerender-trigger",
    "maxConcurrentRoutes": 5,
  }
}
