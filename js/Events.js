import Navigo from 'navigo'

import getHeaderContent from './header'
import getFooterContent from './footer'

var router = new Navigo('/');
window.router = router
window.gLang = 'en'
window.gPlant = ''


export default function Events() {

	var cache = {}
	var currentRoute, lastRoute

	this.init = function () {

		this.initKeyEvents();

		// setupLangMenu(gLang)

		setupRouter();
	}

	function buildCache() {
		document.dispatchEvent(new Event('prerender-trigger'));
		if (!cache['front']) cache['front'] = buildFrontPage(true);
		if (!cache['plants']) cache['plants'] = gPlants.buildPlantList()
	}

	function setGlobals(p, pageName, callback) {
		gPage = pageName;
		if (typeof p === undefined) gLang = 'en'
		else gLang = p.lang.length !== 2 ? 'en' : p.lang
		setLanguage(callback)
	}

	var buildPage = function () {
		document.title = gLangMain.meta.title
		document.querySelector('meta[name=description]').setAttribute('content', gLangMain.meta.desc)
		document.querySelector('meta[property=og\\:title]').setAttribute('content', gLangMain.meta.title)
		document.querySelector('#logo img').setAttribute('alt', gLangMain.meta.title + ' Logo')

		// import('./header.js').then(function(e){
		// 	document.querySelector('header > nav').innerHTML = e
		// 	setupLangMenu(gLang)
		// })

		document.querySelector('header > nav').innerHTML = getHeaderContent(gLangMain)
		setupLangMenu(gLang)
		document.getElementsByTagName('footer')[0].innerHTML = getFooterContent(gLangMain)

		setTimeout(buildCache, 200)

		// import('./footer'.js).then(function(e){
		// 	document.getElementsByTagName('footer')[0].innerHTML = e
		// 	setTimeout(buildCache,200)
		// })

	}

	var setLanguage = function (callback) {
		console.log("setLang:" + gLang)
		if (gLang === 'en') import('../data/lang/en/main').then(function () {
			buildPage()
			callback()
		})
		else if (gLang === 'de') import('../data/lang/de/main').then(function () {
			buildPage()
			callback()
		})
		else return false
		document.documentElement.setAttribute('lang', gLang)
		document.cookie = "nf_lang=" + gLang;
	}

	function setupRouter() {
		// cache = {}
		router
			.on({
				':lang/🌿': function (p) {
					setGlobals(p, 'plants', loadPlantList)
				},
				':lang/🌿/:id': function (p) {
					gPlant = p.id
					setGlobals(p, 'plant', loadPlantPage)
					console.log("plant.id: " + gPlant)
				},
				':lang': function (p) {
					console.log("landing?!")
					setGlobals(p, 'front', gEvents.loadStartPage)
					//TODO: Check if changes, otherwise dont render again
				},
				'*': function (p) {
					setGlobals(p, 'front', gEvents.loadStartPage)
					// (); scrollToPos(0);
				}
			})
			.resolve();

		console.log("gPage: " + gPage)
		console.log("gLang: " + gLang)
		document.body.className = gPage //for first load

		router.getLinkPath = function (link) {
			var href = gLang === 'en' ? link.getAttribute('href') : gLang + '/' + link.getAttribute('href');
			if (href[0] === '/') href = href.replace('/', './')
			return href;
		}
		// router.getLinkPath = function(link){
		// 	var location = link.getAttribute('href');
		// 	console.log(location)
		// 	console.log(link)
		// 	  e.preventDefault();
		// 	// router.navigate(location);
		// 	return false

		// }

		router.hooks({
			before: function (done, params) {
				// console.log(params)x
				// console.log("router before")
				// console.log(done)
				// console.log(params)
				// if(!currentRoute) currentRoute = window.location.href
				// console.log(window.location.href)
				// lastRoute = currentRoute;
				// currentRoute = router.lastRouteResolved()
				done()
			},
			after: function (params) {
			}
		});

	}

	var loadPlantPage = function () {
		var plantObj = gPlantDataLang[gPlant];
		if (plantObj === undefined) {
			//find in language
			for (var o in gPlantDataLang) {
				var slug = toSlug(gPlantDataLang[o].name)
				if (slug !== gPlant) continue
				//success
				gPlant = o
				// console.log(gPlant)
				loadPlantPage();
				return false;
			}
			router.navigate('');
			return false
		}
		gPlants.load(plantObj);
		scrollToPos(0);
	}

	var setupLangMenu = function () {
		var menu = document.getElementById('lang-select')
		menu.addEventListener('change', onLangMenuChange, false)
		menu.value = '_change';
		// setLanguage(gLang)
	}

	var onLangMenuChange = function (e) {
		var lang = e.target.value
		if (lang !== 'en' && lang !== 'de') return false;
		if (lang === 'en') lang = '';
		window.location.href = '/' + lang;
	}

	var loadPlantList = function () {
		if (cache['plants']) gPlants.reload(cache['plants'])
		else {
			cache['plants'] = gPlants.buildPlantList()
			gPlants.reload(cache['plants']);
		}
	}

	this.loadStartPage = function (keepHash) {
		//if (!keepHash) router.navigate('')
		// gInput.clearInput()
		if (cache['front']) gPlants.reload(cache['front'])
		else {
			buildFrontPage()
		}
	}


	var buildFrontPage = function (preload) {
		import('./frontpage').then(function (e) {
			cache['front'] = e(gLangMain);
			if (!preload) gEvents.loadStartPage()
		})
	}

	var toTop = function () {
		scrollToPos(0);
	}

	var scrollToElem = function (selector) {
		var checkExist = setInterval(function () {
			console.log(document.querySelector(selector))
			if (document.querySelector(selector)) {
				clearInterval(checkExist);
				window.scrollTo({
					top: document.querySelector(selector).offsetTop,
					behavior: 'smooth'
				});
			}
		}, 50); // check every 50ms
	}

	var scrollToPos = function (pos) {
		window.scrollTo({
			top: pos,
			behavior: 'smooth'
		});
	}

	this.beforeReload = function () {
		document.body.onclick = function () {

		}
	}

	this.afterReload = function () {
		document.body.className = gPage
		router.updatePageLinks()
		if (gPage === 'plants') gInput.findInput();
		if (gPage === 'front') decodeMail();
		scrollOrFocusInput()
		document.activeElement.blur();
	}

	var scrollOrFocusInput = function () {
		if (gPage !== 'plants') return false
		if (!gInput.input) return false
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


		if (gPage === 'plant' && e.keyCode === 27) router.navigate('🌿')
		if (gPage === 'plant' && e.keyCode === 8) window.history.back()
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
				if (gInput.input) gInput.input.blur()
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
