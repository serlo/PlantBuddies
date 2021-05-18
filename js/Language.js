var storedLang = "";

export default function Language() {
  this.active = "en";

  var default_de = "";
  var default_en = "";

  this.init = function () {
    default_en = document.querySelector("#results .default").innerHTML;

    this.active = this.getLanguage();

    // this.setLanguage(this.active);

    // initClicks();
    //$('#lang-menu a.'+this.active).addClass("hidden");
  };

  this.getLanguage = function () {
    storedLang = localStorage.getItem("activeLanguage");
    // console.log("stored:" + storedLang); //debug
    //if(storedLang === null) {
    var browserLang =
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage;
    if (browserLang === "de-DE" || browserLang === "de") browserLang = "de";
    else browserLang = "en";
    //return browserLang;
    // console.log("detected:" + browserLang); //debug
    //}
    //else return storedLang;

    if (storedLang === null) return browserLang;
    else return storedLang;
  };

  this.setLanguage = function (lang) {
    var change = false;
    if (this.active != lang) change = true;

    this.active = lang;

    if (typeof Storage === "undefined") return;

    localStorage.setItem("activeLanguage", this.active);

    //$('#lang-menu a.hidden').removeClass("hidden");
    //$('#lang-menu a.'+this.active).addClass("hidden");

    $("body").removeClass("en de").addClass(this.active);

    if (this.active === "en") {
      // $('#results .default.de').html('');
      // $('#plant-input').attr('placeholder','lonely plant here…');
      if ($("#results .default.en").html() === "")
        $("#results .default.en").html(default_de);
    }
    if (this.active === "de") {
      // $('#results .default.en').html('');
      // if( $('#results .default.de').html()==='' ) $('#results .default.de').html(default_de);
      $("#plant-input").attr("placeholder", "Pflanze hier eingeben…");
    }

    // if (change) {
    //     gEvents.loadFromHash(window.location.hash);
    // }
    //redirect
    //window.location.replace("/de");
  };

  var initClicks = function () {
    // console.log("init");
    $("#lang-menu a").click(function (e) {
      e.preventDefault();
      var lang = $(this).attr("href").substr(1);
      gLanguage.setLanguage(lang);
    });
  };
} //Language
