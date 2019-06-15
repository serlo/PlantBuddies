import Input from './Input'
require('/data/relations-data.js')
require('/data/plants-array.js')


export default function Plants() {

	var container;

	this.init = function () {
		//where did I put the milk?
		container = document.querySelector("main");
	}


	this.load = function (plantObj) {
		if (plantObj === undefined) return false;

		const relations = getRelations()

		var url = getImageSrc(gPlant);
		var noteTag = plantObj.note.length > 0 ? `<blockquote>${plantObj.note}</blockquote>` : ''
		var html = '';

		html += `<img class="main" alt="Icon for ${gPlant}" src="${url}"/>
		<h1><a class="button" href="🌿" title="${gLangMain.show_all}" data-navigo>${plantObj.name}</a></h1>`;
		if (plantObj.alt) html += `<p class="gray">${gLangMain.aka} <b> ${plantObj.alt} </b></p>${noteTag}`;

		//TODO: warn if no buddies found
		// if (result.length === 0) {
		// 	console.error("Sorry! no hits.");
		// }

		html += `<div id="results"><div><h3>${gLangMain.friends}</h3>
		<ul class="good">${relationsMap(relations,0)}</ul></div>
		<div><h3>${gLangMain.no_friends}</h3><ul class="bad">${relationsMap(relations,1)}</ul></div></div>
		<div class="more-options"><a href="🌿" data-navigo>${gLangMain.show_all}</a></div>` + getShareButtons(plantObj.name);

		this.reload(html);
	}

	// var getBuddyImage = function (slug) {
	// 	var url = getImageSrc(slug);
	// 	return '<img alt="' + slug + ' Illustration" src="' + url + '" class="buddy-img"/>';
	// }

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

		// console.log(secondaryId)

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
		+ '</span><a href="🌿/' + plantObj.id + '" data-navigo>'
		+ getBuddyImage(secondaryId) + `<span>${gLangMain.relation_open_plant}</span></a></div>`;

		str += `<li><a class="toggle fc" onClick="openBuddy(event)" aria-label="${gLangMain.slideDown}" href="#" title="${gLangMain.relation_more}">
		${plantObj.name}</a><div>${details}<div></li>`;

		return str;
	}



	var getRelations = function(){
		let likey = []
		let nolikey = []

		for (let i = 0; i < gRelationsArray.length; i++) {
			const rel = gRelationsArray[i]

			if (rel.p1 !== gPlant && rel.p2 !== gPlant) continue

			const relatedPlantId = rel.p2 !== gPlant ? rel.p2 : rel.p1

			//get rid of duplicates,
			//TODO: data should only have one relation per match in the long run!!
			if (likey.find(x => x.id === relatedPlantId) || nolikey.find(x => x.id === relatedPlantId)) continue

			let relatedPlant = {}
			relatedPlant.comment = gRelations['r' + rel.id]
			relatedPlant.id = relatedPlantId
			relatedPlant.name = gPlantDataLang[relatedPlantId].name

			if (rel.b === 1) likey.push(relatedPlant)
			if (rel.b === -1) nolikey.push(relatedPlant)
		}

		likey.sort((a, b) => a.name.localeCompare(b.name))
		nolikey.sort((a, b) => a.name.localeCompare(b.name))

		return [likey, nolikey]
	}

	var relationsMap = function (relations, good) {
    return relations[good].map((item, i) => (
      getRelation(item.id, item)
    )).join('')
	}

	var getImageSrc = function (plantID) {
		var path = '/img/' + plantID + '.svg'
		var url = gPlantData[plantID].img !== undefined ? path : '/img/default.svg';
		return url;
	}


	var getRelation = function(plantID, plant) {
		const src = getImageSrc(plantID)
		const altName = !plant.alt ? '' : ' ' + plant.alt
		const alt = plant.name + altName + ' ' + gLangMain.companion_partners
		const href = '🌿/' + toSlug(gPlantDataLang[plantID].name)

		return `
		<li>
			<a href="#open-details" class="toggle fc" onClick="openBuddy(event)" title=${gLangMain.relation_more}>${plant.name}</a>
			<div>
				<span>${plant.comment}</span>
				<a href="${href}" data-navigo>
					<img src="${src}" alt="${alt}"/>
					<span>${gLangMain.relation_open_plant}</span>
				</a>
			</div>
		</li>
		`
	}


	var filterContent = function (str) {
		if (str === undefined) return '';
		return str.split('$$$')[0];
	}

	this.buildPlantList = function () {

		gInput = new Input();
		gInput.init();

		var html = gInput.getFilterCode();
		html += '<ul id="buddy-grid" class="buddy-grid">';
		var num = 0;

		window.gPlantsArray.map((id, i) => {
			var plant = gPlantDataLang[id]
			var hidden = ''
			var href = '🌿' + '/' + id
			var altName = (typeof plant.alt === 'undefined') ? '' : ' ' + plant.alt
			var alt = plant.name + altName + ' Illustration'

			html += '<li ' + hidden + '><a href="' + href + '" data-navigo title="Open ' + plant.name + '"><img src="' + getImageSrc(id) + '" alt="' + alt + '"/><span>' + plant.name + '</span></a></li>';
		})

		// for (var i = 0; i < gPlantData.length; i++) {
		// 	var plant = gPlantData[i]
		// 	var hidden = ''
		// 	var href = '🌿' + '/' + plant.id
		// 	var altName = (typeof plant.alt === 'undefined') ? '' : ' ' + plant.alt
		// 	var alt = plant.name + altName + ' Illustration'

		// 	html += '<li ' + hidden + '><a href="' + href + '" data-navigo title="Open ' + plant.name + '"><img src="' + getImageSrc(plant.id) + '" alt="' + alt + '"/><span>' + plant.name + '</span></a></li>';
		// }

		html += '</ul><div hidden id="no-results">'+ gLangMain.no_plant_found +' <a href="#'+gLangMain.show_all+'" onClick="clearFilter(event)">'+gLangMain.no_plant_found_link_text+'</a></div>'
		return html;
	}

}//Plants
