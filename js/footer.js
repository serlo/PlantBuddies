
module.exports = function getFooterContent(langObj) {
return `
<div>
  ${langObj.menu.made_by}<br />
  ${langObj.menu.sus_link}
  &<br />
  ${langObj.menu.perma_link}
  <br />--<br />${langObj.menu.illus}
  <a href="https://elenabauer.de/" title="Website Elena Bauer">Elena</a>
</div>
`}
