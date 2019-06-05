import Navigo from 'navigo'
var router = new Navigo('/');
window.router = router

export default function Events() {

	var defaultHTML;

	this.init = function () {


		setupRouter();
		// initKeyEvents();
		this.initClickEvents();

		defaultHTML = $('#results').html();
	}


	function setupRouter() {

		router
			.on({
				'list': function () {
					setContent('About');
				},
				'buddies': function () {
					toBuddyGrid();
				},
				'top': function () {
					toTop();
				},
				'plant/:id': function (id) {
					loadPlantPage(id.id)
				},
				'': function () {
					//TODO: Check if changes, otherwise dont render again
					console.log("landing!")
					gEvents.loadStartPage(); scrollToPos(0);
				},
				'*': function () {
					gEvents.loadStartPage(); scrollToPos(0);
				}
			})
			.resolve();


	}

	this.initClickEvents = function () {

		$("#results .show-all-link").click(function (e) {
			e.preventDefault();

			$('#results .buddy-grid .hidden').slideDown();
			console.log($('#results .buddy-grid .hidden'));
			if ($(this).attr('href') === '#top') {
				toTop();
				$('#plant-input').focus();
				return true;
			}
			$(this).fadeOut('600', function () {
				if (gLanguage.active === 'en') $(this).html('<span>You can also use the 🔍 searchbar at the top</span> ▴').attr('href', '#top').fadeIn();
				if (gLanguage.active === 'de') $(this).html('<span>Du kannst auch die 🔍 Suchleiste oben benutzen</span> ▴').attr('href', '#top').fadeIn();
			});
			// _paq.push(['trackEvent', 'SlideToggle', 'Show Buddy List']);
		});

		// $('#results .privacy-content').each(function () { $(this).css("height", $(this).height()); }).hide();

		// $("#results .toggle-privacy-content").click(function (e) {
		// 	e.preventDefault();
		// 	$('#results .privacy-content').slideToggle();
		// 	$('#results .privacy-wrap').removeClass('gray');
		// });

	}

	var loadPlantPage = function (id) {
		// $('#results .default').hide();
		// console.log('plant:' + id)
		var plantObj = $.grep(gPlantData, function (e) { return e.id == id })[0];
		if (plantObj === undefined) router.navigate('/')

		if (gLanguage.active === 'en') $('.typeahead').typeahead('val', plantObj.name);
		if (gLanguage.active === 'de') $('.typeahead').typeahead('val', plantObj.name_de);
		gPlants.load(plantObj);
		scrollToPos(0);
	}

	this.loadStartPage = function (keepHash) {
		//if (!keepHash) router.navigate('')
		gInput.clearInput();
		gIsFront = true;
		gPlants.reload(defaultHTML);
	}

	var toBuddyGrid = function () {
		gEvents.loadStartPage();
		scrollToElem('#results .buddy-grid-title');
	}

	var toTop = function () {
		scrollToPos(0);
	}

	var scrollToElem = function (selector) {
		var checkExist = setInterval(function () {
			if ($(selector).length) {
				clearInterval(checkExist);

				$('html, body').stop().animate({
					scrollTop: $(selector).offset().top
				}, 600);
			}
		}, 100); // check every 100ms
	}

	var scrollToPos = function (pos) {
		$('html, body').stop().animate({
			scrollTop: pos
		}, 600);
	}

	this.beforeReload = function () {
		$('body').toggleClass('front', gIsFront);
	}

	this.afterReload = function () {
		gEvents.initClickEvents();
		router.updatePageLinks()
		if (gIsFront) decodeMail();
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
