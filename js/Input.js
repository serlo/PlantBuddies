function Input(){

	var input;

    this.init = function(){

    	input = $('#plant-input');

    	setupTypeahead();
    	initSelectEvent();
    	initEnterEvent();
    	initOnDelete();
    }

    var setupTypeahead = function(){
		input.typeahead({
			hint: true,
			highlight: true,
			minLength: 0
		},{
			name: 'gPlantData',
			display: buildDisplayString,
			limit:30,
			source: substringMatcher(),
			templates: {
				empty: [
				'<div class="empty-message">',
					'unable to match the current query',
				'</div>'
				].join('\n'),
				suggestion: function(obj){
					if(!obj.alt) obj.alt = '';
					return ("<div>"+obj.name+" <span class='gray'>"+obj.alt+"</span></div>"); }
			}
		});
    } //setupTypeahead

    var initSelectEvent = function(){
		input.on('typeahead:select typeahead:autocomplete', function(e, suggestion) {
			gEvents.updateHash(suggestion.id);
			gPlants.load(suggestion);
		});
    } //initSelectEvent

	var substringMatcher = function() {

		return function findMatches(q, cb) {
	    	var matches, substrRegex;
	    	matches = [];
	    	substrRegex = new RegExp(q, 'i');

	    for (var i = 0, len = gPlantData.length; i < len; i++) {
	    	var name = gPlantData[i].name;
	    	var altName = gPlantData[i].alt;
	    	var id = gPlantData[i].id;
	    	if( !plantReady(id,gPlantData[i].note) ) continue;
			if (substrRegex.test(name) || substrRegex.test(altName)) {
				matches.push( gPlantData[i] );
			}
		}
	    cb(matches);
	  };
	} //substringMatcher

	var buildDisplayString = function(suggestion){
		// if(!suggestion.alt) suggestion.alt = '';
		return suggestion.name;
	}

	var initEnterEvent = function() {

		//hack to get autocomplete on enter
		$(document).on('keypress', '#plant-input', function(e) {
	        if(e.keyCode == 13) {            
	            e.preventDefault();
				var selectables = input.siblings(".tt-menu").find(".tt-selectable");
		        if (selectables.length > 0) $(selectables[0]).trigger('click');
	        }
    	});

	} //initEnterEvent

	var initOnDelete = function(){
		input.on("keyup cut", function() {
		   if(input.typeahead('val') === '') gEvents.loadStartPage();
		});
	} // initOnDelete

	this.clearInput = function(){
		input.typeahead('val','');
	}

}//Input