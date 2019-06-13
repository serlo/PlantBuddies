import Navigo from 'navigo'
var router = new Navigo('/');
window.router = router

export default function Events() {

	var defaultHTML;

	this.init = function () {


		setupRouter();
		this.initKeyEvents();
		this.initClickEvents();

		defaultHTML = $('#results').html();
	}


	function setupRouter() {

		router
			.on({
				'plants': function () {
					loadPlantList();
					gPage = 'plants';
				},
				'buddies': function () {
					toBuddyGrid();
					gPage = 'front';
				},
				'top': function () {
					toTop();
				},
				'plant/:id': function (id) {
					gPage = 'plant';
					loadPlantPage(id.id)
				},
				'': function () {
					//TODO: Check if changes, otherwise dont render again
					gPage = 'front';
					gEvents.loadStartPage();
				},
				'*': function () {
					gEvents.loadStartPage(); scrollToPos(0);
					gPage = 'front';
				}
			})
			.resolve();

		// router.hooks({
		// 	before: function(done, params) {
		// 		// console.log(done)
		// 		// console.log(params)
		// 		done()
		// 	 },
		// 	after: function(params) {
		// 	 }
		// });

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
		var plantObj = $.grep(gPlantData, function (e) { return e.id == id })[0];
		if (plantObj === undefined) router.navigate('/')

		gPlants.load(plantObj);
		scrollToPos(0);
	}

	var loadPlantList = function () {
		gPlants.reload(gPlants.buildPlantList());
	}

	this.loadStartPage = function (keepHash) {
		//if (!keepHash) router.navigate('')
		// gInput.clearInput();
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
				}, 500);
			}
		}, 100); // check every 100ms
	}

	var scrollToPos = function (pos) {
		$('html, body').stop().animate({
			scrollTop: pos
		}, 500);
	}

	this.beforeReload = function() {
		$('body').toggleClass('front', gPage !== 'plant');
	}

	this.afterReload = function () {
		gEvents.initClickEvents();
		router.updatePageLinks()
		gInput.findInput();
		if (gPage === 'front') decodeMail();
		scrollOrFocusInput()
		document.activeElement.blur();
		document.dispatchEvent(new Event('prerender-trigger'));
	}

	var scrollOrFocusInput = function () {
		if (gPage !== 'plants') return false
		if (window.innerHeight > 700) gInput.input.focus()
		else {
			setTimeout(function () {
				window.scroll({ top: gInput.input.offsetTop - 20 })
			}, 50)
		}
	}

	this.initKeyEvents = function () {
		//list and input set in plantsFilter

		document.addEventListener('keydown', onKeyDown, false)
	}

	//TODO: INPUT AND FILTER EVENTS
	function onKeyDown(e) {
		const onInput = e.target.tagName.toLowerCase() === 'input'
		if (gPage !== 'plants') return true

		if (
			!onInput &&
			e.keyCode >= 65 &&
			e.keyCode <= 90 &&
			!e.altKey &&
			!e.ctrlKey &&
			!e.metaKey
		) {
			gInput.input.focus()
			return true
		}

		switch (e.keyCode) {
			case 27: //esc
				setFilter('')
				gInput.input.blur()
				break

			case 13: //enter
				if (onInput) setFilterToFirstPlant()
				break

			case 38: //up arrow
				moveFocus(-4, e)
				break
			case 40: //down arrow
				moveFocus(4, e)
				break
			case 37: //left arrow
				if (!onInput) moveFocus(-1, e)
				break
			case 39: //right arrow
				if (!onInput) moveFocus(1, e)
				break

			default:
				return true
		}
	}

	function moveFocus(incr, e) {
		e.preventDefault()

		let pos = 0
		const lis = gInput.list.querySelectorAll('li:not([hidden])')
		const activeLiPos = [].indexOf.call(lis, document.activeElement.parentElement)

		if (activeLiPos > -1) {
			pos = incr + activeLiPos
		}
		if (pos < 0) {
			gInput.input.focus()
			return
		}
		if (pos > lis.length - 1) pos = lis.length - 1
		lis[pos].firstElementChild.focus()
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
