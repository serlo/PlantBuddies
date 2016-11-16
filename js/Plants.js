function Plants(){

	var container, inputWrap, buddyGrid, buddyGridTitle;
	var admin = false;

    this.init = function(){
    	//where did I put the milk?

    	container = $("#results");
    	inputWrap = $('div.input-wrap');
    	buddyGrid = $('#buddy-grid');
    	buddyGridTitle = $('#buddy-grid-title');

    	fillBuddyGrid();
    }

	this.load = function(suggestion){

		if(suggestion === undefined) return false;

		// var result = $.grep(gRelationsData, function(e){ return e.plant1 === suggestion.id });
		var result = $.grep(gRelationsData, function(e){ return e.plant1 == suggestion.id || e.plant2 == suggestion.id  });		
		 //|| e.plant1 === suggestion.id;
		var html = '';

		html += getMainImage(suggestion.id);

		html += '<div class="note">';
		if(suggestion.alt) html += '<p class="gray">Also known as <b>'+suggestion.alt+'</b></p><br>';
		html += '<p>'+filterContent(suggestion.note)+'</div>';

		if(result.length === 0) {
			console.log("sorry, no hits.");
		}

		var likey = [];
		var nolikey = [];

		//sort by state
		for (var i = 0; i < result.length; i++) {
			if( result[i].state === "good" ) likey.push(result[i]);
			if( result[i].state === "bad" ) nolikey.push(result[i]);
			//neutral: out
		}

		//might like
		html += '<div class="good"><h3>potential buddies</h3>';
		html += buildRelations(likey, result, suggestion);

		//won't like
		html += '</div><div class="bad"><h3>dislikes</h3>';
		html += buildRelations(nolikey, result, suggestion);

		html += '</div><hr class="clear"/> <div class="backlink"><a href="#buddies">Show me all the plants</a></div>';
	  	
	  	fadeReload(html);
	}

	var getImageSrc = function(slug){
		var url = 'img/default.jpg';
		if( hasImage(slug) ) url = 'img/plants/'+slug+'.jpg';
		return url;
	}

	var getMainImage = function(slug){
		var url = getImageSrc(slug);
		return '<img alt="Icon for '+slug+'" src="'+url+'" id="main-img" class="main-img"/>';
	}
	
	var getBuddyImage = function(slug){
		var url = getImageSrc(slug);
		return '<img alt="Icon for '+slug+'" src="'+url+'" class="buddy-img"/>';
	}	

	this.reload = function(html) {
		fadeReload(html);
	}

	var fadeReload = function(html){

		var elems = container;//.add(inputWrap);

		container.stop().fadeOut('', function() {
			container.html(html);
			initBuddyClick();
			gEvents.initClickEvents();
		}).fadeIn();
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
			html += getOneRelation(relationPlants[i], suggestion);
		}


		return html;
	}


		// for (var i = 0; i < relationPlants.length; i++) {

		// 	var plantId = relationPlants[i].plant2;
		// 	//if(suggestion.id === plantId) plantId = result[i].plant2;
			
		// 	if(suggestion.id === plantId) continue;

		// 	var plantObj = $.grep(gPlantData, function(e){return e.id == plantId})[0];

		// 	if( plantObj === undefined ) {
		// 		console.log("error: "+plantId);
		// 	}

		// 	var comment = '';
		// 	details = ' <div class="details">' + getBuddyImage(plantId) + relationPlants[i].comment + ' <p><a class="search-link" href="#'+ plantObj.id +'" title="Find companionship for this one!">Find Companions for this one!</a></p></div>';

		// 	html += '<div class="buddy"><a class="toggle" href="#" title="What\'s the reason?">'+ plantObj.name +'</a>' + details + '</div>';
		// }

	var getOneRelation = function(thisRelation, suggestion){

			var plant1 = thisRelation.plant1;
			var plant2 = thisRelation.plant2;
			
			var secondaryId;

			if( plant1 === plant2 ) secondaryId = plant1;
			else if( plant1 === suggestion.id ) secondaryId = plant2;
			else if( plant2 === suggestion.id ) secondaryId = plant1;
			
			//if(suggestion.id === secondaryId) secondaryId = result[i].plant2;

			var plantObj = $.grep(gPlantData, function(e){return e.id == secondaryId})[0];

			if( plantObj === undefined ) {
				console.error("error: \r\n secondaryId: "+secondaryId+ "\r\n plant1: "+plant1);
				return false;
			}

			var str = '';
			details = ' <div class="details"><p>' + filterContent(thisRelation.comment) + '</p><a class="img-hover" href="#'+ plantObj.id +'">' +getBuddyImage(secondaryId) + '<div>Find a Buddy for this one.</div></a> </div>';
			str += '<div class="buddy"><a class="toggle" href="#" title="What\'s the reason?">'+ plantObj.name +'</a>' + details + '</div>';

			return str;
	}

	var filterContent = function(str){
		
		return str.split('$$$')[0];
	}

	var fillBuddyGrid = function(){

		//buddyGridTitle.append(' ('+gPlantData.length+')');
		var html = '<ul>';

		for (var i = 0; i < gPlantData.length; i++) {
			var id = gPlantData[i].id;
			if(!plantReady(id,gPlantData[i].note)) continue;
			html += '<li><a class="img-hover" href="#'+gPlantData[i].id+'"><img src="'+getImageSrc(id)+'"/><div>'+ gPlantData[i].name + '</div></a></li>';
		}

		buddyGrid.html(html);
	}

}//Plants