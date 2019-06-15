
//Todo: For Loop
let routesArray = ["/","/🌿","/🌿/amaranth"]

module.exports = {
    "routes": routesArray,
    "rendererConfig": {
      "headless": false,
      "renderAfterDocumentEvent": "prerender-trigger"
    }
}
