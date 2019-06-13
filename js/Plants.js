export default function Plants() {

	var container, inputWrap, buddyGrid, buddyGridTitle;

	this.init = function () {
		//where did I put the milk?

		container = $("#results");
		inputWrap = $('div.input-wrap');
		buddyGrid = $('#results .buddy-grid');
		buddyGridTitle = $('#results .buddy-grid-title');

		// this.fillBuddyGrid();
	}

	this.load = function (suggestion) {
		if (suggestion === undefined) return false;

		// var result = $.grep(gRelationsData, function(e){ return e.plant1 === suggestion.id });
		var result = $.grep(gRelationsData, function (e) { return e.plant1 == suggestion.id || e.plant2 == suggestion.id });
		//|| e.plant1 === suggestion.id;
		var html = '';

		html += getMainImage(suggestion.id);

		html += '<div class="note">';
		if (gLanguage.active === 'en') if (suggestion.alt) html += '<p class="gray">Also known as <b>' + suggestion.alt + '</b></p>';
		if (gLanguage.active === 'de') if (suggestion.alt) html += '<p class="gray">Auch bekannt als <b>' + suggestion.alt_de + '</b></p>';

		if (gLanguage.active === 'en') html += '<p>' + filterContent(suggestion.note) + '</div>';
		if (gLanguage.active === 'de') html += '<p>' + filterContent(suggestion.note_de) + '</div>';

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
		html += '<div class="clear">&nbsp;</div>';
		if (gLanguage.active === 'en') html += '<div class="good"><h3>Potential Buddies</h3>';
		if (gLanguage.active === 'de') html += '<div class="good"><h3>Mögliche Freunde</h3>';
		html += buildRelations(likey, result, suggestion);

		//won't like
		if (gLanguage.active === 'en') html += '</div><div class="bad"><h3>dislikes</h3>';
		if (gLanguage.active === 'de') html += '</div><div class="bad"><h3>Abneigungen</h3>';
		html += buildRelations(nolikey, result, suggestion);

		if (gLanguage.active === 'en') html += '</div><hr class="clear"/> <div class="more-options"><a href="buddies" data-navigo>Show me all the plants</a></div>' + getShareButtons(suggestion.name, suggestion.name_de);
		if (gLanguage.active === 'de') html += '</div><hr class="clear"/> <div class="more-options"><a href="buddies" data-navigo>Zeig mir alle Pflanzen</a></div>' + getShareButtons(suggestion.name, suggestion.name_de);

		this.reload(html);
	}

	var getImageSrc = function (slug) {
		const path = '/img/' + slug + '.svg'
		var url = hasImage(slug) ? path : '/img/default.svg';
		return url;
	}

	var getMainImage = function (slug) {
		var url = getImageSrc(slug);
		return '<img alt="Icon for ' + slug + '" src="' + url + '" id="main-img" class="main-img"/>';
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
		container.stop(true).fadeOut(150, function () {
			container.html(html);
			initBuddyClick();
			gEvents.afterReload();
			setShareHrefs();
		}).fadeIn(150);
	}

	var initBuddyClick = function () {
		$('div.buddy > a.toggle', container).click(function (e) {
			e.preventDefault();
			var elem = $(e.target).siblings('div.details');
			$('div.details', container).not(elem).slideUp('fast');
			elem.slideToggle('fast');
		});
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

		var plantObj = $.grep(gPlantData, function (e) { return e.id == secondaryId })[0];

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
		if (gLanguage.active === 'en') details = ' <div class="details"><p>' + filterContent(thisRelation.comment) + '</p><a class="img-hover" href="plant/' + plantObj.id + '" data-navigo>' + getBuddyImage(secondaryId) + '<div>Find a Buddy for this one.</div></a> </div>';
		if (gLanguage.active === 'de') details = ' <div class="details"><p>' + filterContent(thisRelation.comment_de) + '</p><a class="img-hover" href="plant/' + plantObj.id + '" data-navigo>' + getBuddyImage(secondaryId) + '<div>Finde Buddies für diese Pflanze.</div></a> </div>';
		if (gLanguage.active === 'en') str += '<div class="buddy"><a class="toggle" href="#" title="What\'s the reason?">' + plantObj.name + '</a>' + details + '</div>';
		if (gLanguage.active === 'de') str += '<div class="buddy"><a class="toggle" href="#" title="Warum ist das so?">' + plantObj.name_de + '</a>' + details + '</div>';

		return str;
	}

	var filterContent = function (str) {
		if (str === undefined) return '';
		return str.split('$$$')[0];
	}

	this.fillBuddyGrid = function () {

		//buddyGridTitle.append(' ('+gPlantData.length+')');
		var html = '<ul>';
		var num = 0;

		for (var i = 0; i < gPlantData.length; i++) {
			var id = gPlantData[i].id;
			if (!plantReady(id, gPlantData[i].note)) continue;

			if (num == 20) html += '<div class="hidden">';
			num++;

			if (gLanguage.active === 'en') html += '<li><a class="img-hover" href="plant/' + gPlantData[i].id + '" data-navigo><img src="' + getImageSrc(id) + '"/><div>' + gPlantData[i].name + '</div></a></li>';
			if (gLanguage.active === 'de') html += '<li><a class="img-hover" href="plant/' + gPlantData[i].id + '" data-navigo><img src="' + getImageSrc(id) + '"/><div>' + gPlantData[i].name_de + '</div></a></li>';
		}

		if (gLanguage.active === 'en') html += '</div><p class="show-all-link-wrap"><a href="#show-all" class="show-all-link">▾ <span>Show me all of them</span> ▾</a></p></ul>';
		if (gLanguage.active === 'de') html += '</div><p class="show-all-link-wrap"><a href="#show-all" class="show-all-link">▾ <span>Alle anzeigen</span> ▾</a></p></ul>';
		buddyGrid.html(html);
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

		html += '<div hidden id="no-results">${tMain.no_plant_found} <a href="#liste-anzeigen" onClick="clearFilter(event)">${tMain.no_plant_found_link_text}</a></div>'
		return html;
	}

}//Plants
