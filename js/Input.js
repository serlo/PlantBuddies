export default function Input() {

	this.input = {}
	this.list = {}

	var filterBy = ''
	var plantArray = Object.keys(gPlantData)

	this.init = function () {

	}

	this.getFilterCode = function () {

		// ${ t.filter_input_label }
		// ${ t.type_to_search }
		const filter = ''
		const inputHash = Math.random().toString(36).substring(7); //don't autocomplete for now

		return `
			<input
				type="text"
				aria-label="filter-label"
				value="${filter}"
				placeholder="${gLangMain.type_to_search}"
				name="filterinput${inputHash}"
				id="filterinput"
				class="filterinput"
			/>
		`
	}

	this.findInput = function () {
		this.input = document.getElementById('filterinput')
		this.list = document.getElementById('buddy-grid')

		if(this.input) this.input.addEventListener('input', onInput, false)
	}

	var onInput = function (e) {
		gInput.setFilter(e.target.value)
	}

	var clearFilter = function(e) {
		e.preventDefault()
		gInput.setFilter('')
	}

	this.setFilter = function(val) {
		if(!gInput.input) return false
		filterBy = val.toLowerCase()
		gInput.input.value = val
		getFilteredData()
	}

	this.setFilterToFirstPlant = function() {
		const link = gInput.list.querySelector('li:not([hidden]) a')
		link.focus()
		gInput.setFilter(link.innerText)
	}

	var getFilteredData = function() {
		let count = 0
		for (let i = 0; i < plantArray.length; i++) {
			const item = plantArray[i];
			if (gPlantData[item].name.toLowerCase().includes(filterBy) ||
				(typeof gPlantData[item].alt !== 'undefined' && gPlantData[item].alt.toLowerCase().includes(filterBy))) {
				gInput.list.children.item(i).hidden = false
				count++
			}
			else gInput.list.children.item(i).hidden = true
		}
		document.getElementById('no-results').hidden = (count !== 0)
	}

}//Input
