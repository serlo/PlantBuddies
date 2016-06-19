function Events(){

	var defaultHTML;

    this.init = function(){

		// initKeyEvents();
        initHashEvents();
        initClickEvents();

        defaultHTML = $('#results').html();
    }


	var initHashEvents = function(){
		$( window ).on('hashchange',function() {
		    var hash = location.hash;
		    gEvents.loadFromHash(hash);
		});
	}

	var initClickEvents = function(){
		$("#results .search-link").click(function() {
		    e.preventDefault();
		    var href=$(this).attr("href");
		    gEvents.loadFromHash(href);
		});

		$("#results .about-link").click(function() {
		    e.preventDefault();
		    gEvents.loadStartPage();
		});
	}

	this.updateHash = function(hash){
        history.pushState(null, null, '#'+hash);
	}

	this.removeHash = function(){
        history.pushState(null, null, '');
	}

	this.loadFromHash = function(hash) {
	    hash = hash.substr(1);
	    if(hash.length>1) $('#results .default').hide();
		var plantObj = $.grep(gPlantData, function(e){ return e.id == hash })[0];
		if(plantObj === undefined) return false;
		$('.typeahead').typeahead('val', plantObj.name);
		gPlants.load(plantObj);
	}

	this.loadStartPage = function() {
		this.removeHash();
		gPlants.reload(defaultHTML);
	}


	// var initKeyEvents = function(){
	// 	$(document).keydown(function(e) {
	// 		switch(e.which){    
	// 		// case 27: //esc // case 37: //left arrow // case 38: //up arrow // case 39: //right arrow // case 40: //down arrow // case  9: //fall through //case 32: //space
			
	// 		// case 13: //return
	// 		//     e.preventDefault();
	// 		//     // gInput.onEnter();
	// 		// break;

	// 		default:
	// 		break;
	// 		} //switch
	// 	});
	// }

}//Events