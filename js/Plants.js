export default function Plants() {

	var container, inputWrap, buddyGrid, buddyGridTitle;

	this.init = function () {
		//where did I put the milk?

		container = document.querySelector("main");
		inputWrap = document.querySelector('div.input-wrap');
		buddyGrid = document.querySelector('main .buddy-grid');
		buddyGridTitle = document.querySelector('main .buddy-grid-title');

	}

	this.load = function (suggestion) {
		if (suggestion === undefined) return false;

		var result = gRelationsData.filter(function(e) {
    	return e.plant1 == suggestion.id || e.plant2 == suggestion.id
		});

		var url = getImageSrc(suggestion.id);
		var noteTag = suggestion.note.length > 0 ? `<blockquote>${suggestion.note}</blockquote>` : ''
		var html = '';

			//TODO: Build nicer alt string
		  // const alt = plant.name + altName + ' Mischkulturpartner'

		html += '<img class="main" alt="Icon for ' + suggestion.id + '" src="' + url + '"/>';
		html += '<h1><a class="button" href="plants" title="?" data-navigo>'+suggestion.name+'</a></h1>';
		if (suggestion.alt) html += '<p class="gray">You can also call me <b>' + suggestion.alt + '</b></p>'+noteTag;



		if (result.length === 0) {
			console.error("Sorry! no hits.");
		}

		var likey = [];
		var nolikey = [];

		//sort by state
		for (var i = 0; i < result.length; i++) {
			if (result[i].state === "good") likey.push(result[i]);
			if (result[i].state === "bad") nolikey.push(result[i]);
			//neutral: out
		}

		//might like
		html += '<div id="results"><div><h3>Potential Buddies</h3><ul class="good">';
		html += buildRelations(likey, result, suggestion);

		//won't like
		html += '</ul></div><div><h3>dislikes</h3><ul class="bad">';
		html += buildRelations(nolikey, result, suggestion);

		html += '</ul></div></div><div class="more-options"><a href="buddies" data-navigo>Show me all the plants</a></div>' + getShareButtons(suggestion.name, suggestion.name_de);

		this.reload(html);
	}

	var getImageSrc = function (slug) {
		const path = '/img/' + slug + '.svg'
		var url = hasImage(slug) ? path : '/img/default.svg';
		return url;
	}

	var getBuddyImage = function (slug) {
		var url = getImageSrc(slug);
		return '<img alt="Icon for ' + slug + '" src="' + url + '" class="buddy-img"/>';
	}

	this.reload = function (html) {
		gEvents.beforeReload();
		fadeReload(html);
	}

	var fadeReload = function (html) {
		fade(container,false,function(){
				container.innerHTML = html
				gEvents.afterReload();
				setShareHrefs()
				fade(container,true)
			})
	}

	var buildRelations = function (relationPlants, result, suggestion) {
		var html = '';
		for (var i = 0; i < relationPlants.length; i++) {
			html += getOneRelation(relationPlants[i], suggestion);
		}
		return html;
	}

	var getOneRelation = function (thisRelation, suggestion) {

		var plant1 = thisRelation.plant1;
		var plant2 = thisRelation.plant2;

		var secondaryId;

		if (plant1 === plant2) secondaryId = plant1;
		else if (plant1 === suggestion.id) secondaryId = plant2;
		else if (plant2 === suggestion.id) secondaryId = plant1;

		//if(suggestion.id === secondaryId) secondaryId = result[i].plant2;

		// var plantObj = $.grep(gPlantData, function (e) { return e.id == secondaryId })[0];

		var plantObj = gPlantData.filter(function(e) {
    	return e.id == secondaryId
		})[0];

		if (plantObj === undefined) {
			console.error("error: \r\n secondaryId: " + secondaryId + "\r\n plant1: " + plant1);
			console.error("thisrelation: ");
			console.log(thisRelation);
			console.error("suggestion: ");
			console.log(suggestion);
			return '';
		}

		var str = '';
		var details = '';
		details = ' <span>'
		+ filterContent(thisRelation.comment)
		+ '</span><a href="plant/' + plantObj.id + '" data-navigo>'
		+ getBuddyImage(secondaryId) + '<span>Find a Buddy for this one.</span></a></div>';

		str = str
		+ '<li><a class="toggle fc" onClick="openBuddy(event)" href="#" title="What\'s the reason?">'
		+ plantObj.name
		+ '</a><div>' + details + '<div></li>';

		return str;
	}

	var filterContent = function (str) {
		if (str === undefined) return '';
		return str.split('$$$')[0];
	}

	this.buildPlantList = function () {

		var html = gInput.getFilterCode();
		html += '<ul id="buddy-grid" class="buddy-grid">';
		var num = 0;

		for (var i = 0; i < gPlantData.length; i++) {
			var plant = gPlantData[i]
			var hidden = ''
			var href = 'plant' + '/' + plant.id
			var altName = (typeof plant.alt === 'undefined') ? '' : ' ' + plant.alt
			var alt = plant.name + altName + ' Illustration'

			html += '<li ' + hidden + '><a href="' + href + '" data-navigo title="Open ' + plant.name + '"><img src="' + getImageSrc(plant.id) + '" alt="' + alt + '"/><span>' + plant.name + '</span></a></li>';
		}

		html += '</ul><div hidden id="no-results">${tMain.no_plant_found} <a href="#liste-anzeigen" onClick="clearFilter(event)">${tMain.no_plant_found_link_text}</a></div>'
		return html;
	}

}//Plants
