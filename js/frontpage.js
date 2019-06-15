
module.exports = `
<div id="results">
  <div class="default">
    <div class="main-button">
      <a class="button" href="🌿" data-navigo>${gLangMain.select_plant}</a>
    </div>

    <h2>
      ${gLangMain.landing.title}<br /><i> – ${gLangMain.landing.subtitle}</i>
    </h2>
    <p>${gLangMain.landing.instruction}</p>

    <h3>${gLangMain.landing.companion_planting.title}</h3>
    <p>${gLangMain.landing.companion_planting.content}</p>
    <blockquote>${gLangMain.landing.companion_planting.quote}</blockquote>

    <h3 style="margin-top: 7rem;">${gLangMain.landing.license.title}</h3>
    <p>${gLangMain.landing.license.content}</p>

    <h3>${gLangMain.landing.contact.title}</h3>
    <p>${gLangMain.landing.contact.content}</p>

  </div>
</div>
`
