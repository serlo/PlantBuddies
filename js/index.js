import Language from './Language'
import Events from './Events'
import Plants from './Plants'
require('./plantFunctions')

"use strict";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('../sw.js').then(function (registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

//obj
window.gLanguage = []
window.gInput = []
window.gPlants = []
window.gCurrentPlantId = []
window.gPage = []
window.gEvents = []

function setup() {
  document.documentElement.classList.replace('no-js', 'js')

  gPlants = new Plants();
  gPlants.init();

  gEvents = new Events();
  gEvents.init();

}

window.toSlug = function (v) {
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

//TODO:
window.getShareButtons = function getShareButtons(name) {

  if (name.slice(-1) == 's' || name.slice(-1) == 'x' || name.slice(-1) == 's') name += '\'';
  else name += '\'s';

  var html = '';
  html += '<div class="share-note"><b>Share ' + name + ' Buddies:</b><br> <ul class="share-buttons"><li><a rel="noopener" href="https://www.facebook.com" target="_blank" data-share="facebook icon" title="Share on Facebook"><img alt="" src="' + require('../img/socialicons/facebook.svg') + '"></a></li><li><a rel="noopener" href="https://twitter.com" title="Tweet" target="_blank" data-share="twitter"><img alt="twitter icon" src="' + require('../img/socialicons/twitter.svg') + '"></a></li><li><a rel="noopener" href="http://pinterest.com/" title="Pin it" target="_blank" data-share="pinterest"><img alt="pinterest icon" src="' + require('../img/socialicons/pinterest.svg') + '"></a></li><li><a href="#" title="Email" target="_blank" data-share="mail"><img alt="mail icon" src="' + require('../img/socialicons/email.svg') + '"></a></li></ul></div>';

  return html;
}


window.setShareHrefs = function setShareHrefs() {

  var shareLinks = document.querySelectorAll('.share-buttons a');
  Array.prototype.forEach.call(shareLinks, function (link) {

    var url = '';
    var img = document.getElementById('main-img')
    if (!img) return false;

    var img_src = img.src;

    //TODO: Get Plant Name from input field or global Var
    var name = "name"

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
  var link = document.querySelectorAll('.mail');
  if (!link[0]) return false;
  var at = / \[a\] /;
  var dot = / \[:\] /;
  var addr = link[0].innerText.replace(at, "@").replace(dot, ".");
  link[0].innerText = addr
  link[0].setAttribute('href', 'mailto:' + addr + '?subject=[PlantBuddies]');
}

setup();
