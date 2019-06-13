
//Todo: For Loop
let routesArray = ["/","/plants","/plant/amaranth"]

module.exports = {
    "routes": routesArray,
    "rendererConfig": {
      "headless": false,
      "renderAfterDocumentEvent": "prerender-trigger"
    }
}
