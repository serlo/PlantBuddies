

"use strict";

$(document).ready(setup);

//obj    
var gEvents, gInput, gPlants, gLanguage;

var activeLanguage;

function setup(){

	$("html").addClass('js').removeClass('no-js');

    gLanguage = new Language();
    gLanguage.init();

    gPlants = new Plants();
    gPlants.init();

    gEvents = new Events();
    gEvents.init();

    gInput = new Input();
    gInput.init();


    //load from hash
	gEvents.loadFromHash(window.location.hash);

}