import Language from './Language'
import Events from './Events'
import Plants from './Plants'
require('./plantFunctions')

"use strict";
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function () {
//     navigator.serviceWorker.register('../sw.js').then(function (registration) {
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, function (err) {
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// }

//obj
window.gLanguage = []
window.gInput = []
window.gPlants = []
window.gCurrentPlantId = []
window.gPage = []
window.gEvents = []

// const images = require('../img/plants/*.jpg');
// var images = ["amaranth", "apple", "apricot", "asparagus", "aubergine", "basil", "bay", "beet", "blackberry", "blueberry", "borage", "broad_bean", "broccoli", "brussels_sprouts", "cabbage", "carrot", "cauliflower", "celery", "chamomile", "cherry", "chilli_pepper", "chinese_cabbage", "citrus_fruits", "pole_bean", "cucumber", "currant", "fennel", "fig", "garlic", "ginger", "globe_artichoke", "gooseberry", "horseradish", "jerusalem_artichoke", "kale", "leek", "lemon_balm", "lettuce", "marrow", "nasturtium", "nectarine", "onion", "parsnip", "pea", "peach", "peanut", "pear", "plum", "potato", "pumpkin", "quince", "radish", "raspberry", "rose", "rosemary", "spinach", "strawberry", "sweet_pepper", "swiss_chard", "tomato", "walnut"]

function setup() {
  document.documentElement.classList.replace('no-js','js')

  // gLanguage = new Language();
  // gLanguage.init();

  gPlants = new Plants();
  gPlants.init();

  gEvents = new Events();
  gEvents.init();

  //    //load from hash
  // gEvents.loadFromHash(window.location.hash);
}


function resetEvents() {

}

function getCurrentPlantIndex() {
  return gPlantData.findIndex(function (x) { return x.id == gCurrentPlantId });
}

function getRelationsIndex(id) {
  //might not be nessesary but to be sure
  return gRelationsData.findIndex(function (x) { return x.id == id });
}

window.toSlug = function(v) {
  v = v.toLowerCase()
  v = v.replace(/\u00e4/g, 'ae')
  v = v.replace(/\u00f6/g, 'oe')
  v = v.replace(/\u00fc/g, 'ue')
  v = v.replace(/\u00df/g, 'ss')
  v = v.replace(/ /g, '-')
  v = v.replace(/\./g, '')
  v = v.replace(/,/g, '')
  v = v.replace(/\(/g, '')
  v = v.replace(/\)/g, '')
  v = encodeURIComponent(v)
  return v
}

// window.hasImage = function hasImage(slug) {
//   var exists = images.indexOf(slug) > -1
//   return exists
//   // return images[id]
// }

// window.plantReady = function plantReady(id, note) {
//   if (!hasImage(id) || !note) return false;
//   else return true;
// }

window.getShareButtons = function getShareButtons(name) {

  if (name.slice(-1) == 's' || name.slice(-1) == 'x' || name.slice(-1) == 's') name += '\'';
  else name += '\'s';

  var html = '';
  html += '<div class="share-note"><b>Share ' + name + ' Buddies:</b><br> <ul class="share-buttons"><li><a href="https://www.facebook.com" target="_blank" data-share="facebook" title="Share on Facebook"><img src="' + require('../img/socialicons/facebook.svg') + '"></a></li><li><a href="https://twitter.com" title="Tweet" target="_blank" data-share="twitter"><img src="' + require('../img/socialicons/twitter.svg') + '"></a></li><li><a href="http://pinterest.com/" title="Pin it" target="_blank" data-share="pinterest" ><img src="' + require('../img/socialicons/pinterest.svg') + '"></a></li><li><a href="#" title="Email" target="_blank" data-share="mail"><img src="' + require('../img/socialicons/email.svg') + '"></a></li></ul></div>';

  return html;
}


window.setShareHrefs = function setShareHrefs() {

  var shareLinks = document.querySelectorAll('.share-buttons a');
  Array.prototype.forEach.call(shareLinks, function(link){

    var url = '';
    var img = document.getElementById('main-img')
    if (!img) return false;

    var img_src = img.src;

    //TODO: Get Plant Name from input field or global Var
    var name="name"

    var teaser = 'Who likes to grow next to ' + name + '?';
    if (gLanguage.active === 'de') teaser = 'Wer wächst gern neben ' + name + '?';

    var msg = teaser + ' – find out at PlantBuddies (It\'s like online dating for plants)';
    if (gLanguage.active === 'de') msg = teaser + ' – finde es heraus auf PlantBuddies (Wie online dating – für Pflanzen)';

    var fb_text = 'Find great Companions for ' + name + ' at PlantBuddies. It\'s like online dating for plants! \n Ok, it\'s actually about Companion Planting. Some plants just grow well together, while others might be terrible matches.'
    if (gLanguage.active === 'de') fb_text = 'Finde gute Pflanzenpartner für ' + name + ' mit PlantBuddies. Das ist fast wie online dating für Pflanzen! \n Ok, eigentlch geht es um Mischkulturen. Manche Pflanzen wachsen gut und gerne nebeneinander und andere sind schlechte Nachbarn.'
    var site_url = 'https://plantbuddies.serlo.org';

    switch (link.getAttribute('data-share')) {

      case 'facebook':
        url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(site_url) + '&title=' + encodeURIComponent(teaser) + '&description=' + encodeURIComponent(fb_text);
        break;

      case 'twitter':
        url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(msg) + ':%20' + encodeURIComponent(document.URL);
        break;

      case 'pinterest':
        url = 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(document.URL) + '&media=' + encodeURIComponent(img_src) + '?&description=' + encodeURIComponent(msg);
        break;

      case 'mail':
        url = 'mailto:?subject=' + encodeURIComponent(teaser) + '&body=' + encodeURIComponent(msg + '\n\n') + 'Check it out at: ' + encodeURIComponent('\n' + document.URL);
        break;

    }
    link.setAttribute('href', url);
  });
}


window.decodeMail = function decodeMail() {
  var link = document.querySelectorAll('.mail-address');
  if(!link[0]) return false;
  var at = / \[a\] /;
  var dot = / \[:\] /;
  var addr = link[0].innerText.replace(at, "@").replace(dot, ".");
  link[0].innerText = addr
  link[0].setAttribute('href', 'mailto:' + addr + '?subject=[PlantBuddies]');
}

setup();
