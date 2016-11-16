function Plants(){

	var container, inputWrap;
	var admin = true;

    this.init = function(){
    	//where did I put the milk?

    	container = $("#results");
    	inputWrap = $('div.input-wrap');
    }

    this.isAdmin = function(){
    	return admin;
    }

	this.load = function(suggestion){

		if(suggestion === undefined) return false;

		gCurrentPlantId = suggestion.id;

		var result = $.grep(gRelationsData, function(e){ return e.plant1 == suggestion.id || e.plant2 == suggestion.id  });

		 //|| e.plant1 === suggestion.id;

		var html = '';
		html += getMainImage(suggestion.id);
		var altName = suggestion.alt;
		if(!altName) altName = '/'
		html += '<p class="note"><textarea id="plant-note">'+suggestion.note+'</textarea></p>';
		html += '<pre><small><b>alt-name</b> '+altName+' &nbsp;&nbsp; <b>id</b> '+suggestion.id+' &nbsp;&nbsp; <b>latin</b> '+ suggestion.latin + ' &nbsp;&nbsp; <b>german</b> '+ suggestion.german +'</small></pre>';

		if(result.length === 0) {
			console.log("sorry, no hits.");
		}

		html += '<div class="edit">';

		html += buildRelations(result, result, suggestion);

		var select = '<select id="select-plant"><option value="" disabled selected>[Choose]</option>';
		for (var i = 0; i < gPlantData.length; i++) {
			select += '<option value="'+gPlantData[i].id+'">'+gPlantData[i].name+ ' (' + gPlantData[i].german +')</option>';
		}
		select += '</select>'

		html += '<div class="edit-cell"><h3> New Relation with<br>'+select+'<br><br><a href="#add-rel" id="add-rel">ADD!</a></h3></div>';

		// var likey = [];
		// var nolikey = [];

		// //sort by state
		// for (var i = 0; i < result.length; i++) {
		// 	if( result[i].state === "good" ) likey.push(result[i]);
		// 	if( result[i].state === "bad" ) nolikey.push(result[i]);
		// }

		// //might like
		// html += '<div class="good"><h3>potential buddies</h3>';
		// html += buildRelations(likey, result, suggestion);

		// //won't like
		// html += '</div><div class="bad"><h3>dislikes</h3>';
		// html += buildRelations(nolikey, result, suggestion);

		// html += '</div><h1></h1>';
	  	

	  	fadeReload(html);
	}
	
	var getImageSrc = function(slug){
		var url = 'img/default.jpg';
		if(hasImage(slug)) url = 'img/plants/'+slug+'.jpg';
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
	// var getMainImage = function(slug){
	// 	// return '<img src="img/'+slug+'.jpg" id="main-img" class="main-img"/>';
	// 	return '<img src="img/default.jpg" id="main-img" class="main-img"/>';
	// }
	
	// var getBuddyImage = function(slug){
	// 	// return '<img src="img/'+slug+'.jpg"/>';
	// 	return '<img src="img/default.jpg"/>';
	// }	

	this.reload = function(html) {
		fadeReload(html);
	}

	var fadeReload = function(html){


		var elems = container;//.add(inputWrap);

		// container.stop().fadeOut('', function() {
			container.html(html);
			//initBuddyClick();
			resetEvents();
		// }).fadeIn();
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
			html += gPlants.getOneRelation(relationPlants[i], suggestion);
		}

		return html;
	}

	this.getOneRelation = function(thisRelation, suggestion){

			console.log(thisRelation);
			console.log(suggestion);
			console.log("=====");

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

			var comment = '';
			details = ' <div class="details"><textarea>' + thisRelation.comment + '</textarea></div>';
			edit = ' <div class="edit"><a href="#change" class="change">change</a> <a href="#delete" class="delete">del</a> <small>id: '+thisRelation.id+'</small></div>';

			var str = '<div data-state="'+thisRelation.state+'" data-id="'+thisRelation.id+'" class="edit-cell '+thisRelation.state+'"><h3 title="'+plantObj.german+'">'+ plantObj.name +'</h3>'+ details + edit + '</div>';
			return str;

	}

}//Plants