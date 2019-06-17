
module.exports = function getFrontpageContent(langObj) {
return `
<div id="results">
  <div class="default">
    <div class="main-button">
      <a class="button" href="🌿" data-navigo>${langObj.select_plant}</a>
    </div>

    <h2>
      ${langObj.landing.title}<br /><i> – ${langObj.landing.subtitle}</i>
    </h2>
    <p>${langObj.landing.instruction}</p>

    <h3>${langObj.landing.companion_planting.title}</h3>
    <p>${langObj.landing.companion_planting.content}</p>
    <blockquote>${langObj.landing.companion_planting.quote}</blockquote>

    <h3 style="margin-top: 7rem;">${langObj.landing.license.title}</h3>
    <p>${langObj.landing.license.content}</p>

    <h3>${langObj.landing.contact.title}</h3>
    <p>${langObj.landing.contact.content}</p>

  </div>
</div>
`}
