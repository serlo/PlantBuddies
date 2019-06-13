
export default function Input() {

	this.input = {}
	this.list = {}


	this.init = function () {

		// this.input = $('#plant-input');

		// setupTypeahead();
		// initSelectEvent();
		// initEnterEvent();
		// initOnDelete();
		// initActiveEvent();
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
				placeholder="type to search …"
				name="filterinput${inputHash}"
				id="filterinput"
				class="filterinput"
			/>
		`
	}

	this.findInput = function () {
		this.input = document.getElementById('filterinput')
		this.list = document.getElementById('buddy-grid')
	}

}//Input
