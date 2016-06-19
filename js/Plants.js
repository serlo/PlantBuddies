function Plants(){

	var container, inputWrap;

    this.init = function(){
    	//where did I put the milk?

    	container = $("#results");
    	inputWrap = $('div.input-wrap');

    }

	this.load = function(suggestion){

		if(suggestion === undefined) return false;


		var result = $.grep(gRelationsData, function(e){ return e.plant1 === suggestion.id });

		 //|| e.plant1 === suggestion.id;

		var html = '';

		html += getMainImage(suggestion.id);

		html += '<p class="note">'+suggestion.note+'</p>';

		if(result.length === 0) {
			console.log("sorry, no hits.");
		}

		var likey = [];
		var nolikey = [];

		//sort by state
		for (var i = 0; i < result.length; i++) {
			if( result[i].state === "good" ) likey.push(result[i]);
			if( result[i].state === "bad" ) nolikey.push(result[i]);
		}

		//might like
		html += '<div class="good"><h3>potential buddies</h3>';
		html += buildRelations(likey, result, suggestion);

		//won't like
		html += '</div><div class="bad"><h3>dislikes</h3>';
		html += buildRelations(nolikey, result, suggestion);

		html += '</div><h1></h1>';
	  	
	  	fadeReload(html);
	}


	var getMainImage = function(slug){
		// return '<img src="img/'+slug+'.jpg" id="main-img" class="main-img"/>';
		return '<img src="img/default.jpg" id="main-img" class="main-img"/>';
	}
	
	var getBuddyImage = function(slug){
		// return '<img src="img/'+slug+'.jpg"/>';
		return '<img src="img/default.jpg"/>';
	}	

	this.reload = function(html) {
		fadeReload(html);
	}

	var fadeReload = function(html){

		var elems = container;//.add(inputWrap);

		container.stop().fadeOut('', function() {
			container.html(html);
			initBuddyClick();
			imageHack();
		}).fadeIn();
	}

	var imageHack = function(){
		$("#main-img, div.details img",container).on("error", function(e){
			if(this.src!="img/default.jpg") this.src = "img/default.jpg";
		});
	}

	var initBuddyClick = function(){
		$('div.buddy > a.toggle', container).click(function(e){
			e.preventDefault();
			var elem = $(e.target).siblings('div.details');
			$('div.details',container).not(elem).slideUp('fast');
			elem.slideToggle('fast');
		});
	}

	var buildRelations = function(relationPlants, result, suggestion) {

		var html = '';

		for (var i = 0; i < relationPlants.length; i++) {

			var plantId = relationPlants[i].plant2;
			//if(suggestion.id === plantId) plantId = result[i].plant2;
			
			if(suggestion.id === plantId) continue;

			var plantObj = $.grep(gPlantData, function(e){return e.id == plantId})[0];

			if( plantObj === undefined ) {
				console.log("error: "+plantId);
			}

			var comment = '';
			details = ' <div class="details">' + getBuddyImage(plantId) + relationPlants[i].comment + ' <p><a class="search-link" href="#'+ plantObj.id +'" title="Find companionship for this one!">Find Companions for this one!</a></p></div>';

			html += '<div class="buddy"><a class="toggle" href="#" title="What\'s the reason?">'+ plantObj.name +'</a>' + details + '</div>';
		}

		return html;
	}

}//Plants