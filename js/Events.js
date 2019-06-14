import Navigo from 'navigo'
var router = new Navigo('/');
window.router = router

export default function Events() {

	var cache = {}
	var currentRoute, lastRoute

	this.init = function () {

		cache['front'] = document.getElementById('results').innerHTML;
		setupRouter();
		this.initKeyEvents();

		window.onload = function() {
			if( !cache['plants'] ) cache['plants'] = gPlants.buildPlantList()
		};
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
					console.log("plant")
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

					document.body.className = gPage //for first load

		router.hooks({
			before: function(done, params) {
				// console.log("router before")
				// console.log(done)
				// console.log(params)
				// if(!currentRoute) currentRoute = window.location.href
				// console.log(window.location.href)
				// lastRoute = currentRoute;
				// currentRoute = router.lastRouteResolved()
				done()
			 },
			after: function(params) {
			 }
		});

	}

	var loadPlantPage = function (id) {
		var plantObj = gPlantData.filter(function(e) { return e.id == id })[0];
		if (plantObj === undefined) router.navigate('/')
		gPlants.load(plantObj);
		scrollToPos(0);
	}

	var loadPlantList = function () {
		if( cache['plants'] ) gPlants.reload(cache['plants'])
		else {
			cache['plants'] = gPlants.buildPlantList()
			gPlants.reload(cache['plants']);
		}
	}

	this.loadStartPage = function (keepHash) {
		//if (!keepHash) router.navigate('')
		// gInput.clearInput()
		if(!cache['front']) return false;
		gPlants.reload(cache['front']);
	}

	var toBuddyGrid = function () {
		gEvents.loadStartPage();
		scrollToElem('#results');
	}

	var toTop = function () {
		scrollToPos(0);
	}

	var scrollToElem = function (selector) {
		var checkExist = setInterval(function () {
			console.log(document.querySelector(selector))
			if (document.querySelector(selector)) {
				clearInterval(checkExist);
				window.scrollTo( {top: document.querySelector(selector).offsetTop,
				behavior: 'smooth'});
			}
		}, 50); // check every 50ms
	}

	var scrollToPos = function (pos) {
		window.scrollTo( {top: pos,
				behavior: 'smooth'});
	}

	this.beforeReload = function() {
		document.body.onclick = function() {

		}
	}

	this.afterReload = function () {
		document.body.className = gPage
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


		if (gPage === 'plant' && e.keyCode === 27 ) router.navigate('plants')
		if (gPage === 'plant' && e.keyCode === 8 ) window.history.back()
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
				gInput.setFilter('')
				if(gInput.input) gInput.input.blur()
				break

			case 13: //enter
				if (onInput) gInput.setFilterToFirstPlant()
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
}//Events
