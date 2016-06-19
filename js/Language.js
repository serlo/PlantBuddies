function Language(){

    this.init = function(){

    	activeLanguage = 'EN';
    	activeLanguage = localStorage.getItem("activeLanguage");

    	initClicks();

    	$('#lang-menu a.'+activeLanguage).addClass("hidden");
    }

    this.setLanguage = function(lang){

    	activeLanguage = lang;

    	if (typeof(Storage) === "undefined") return;

    	localStorage.setItem("activeLanguage", activeLanguage);

    	// $('#lang-menu a.hidden').removeClass("hidden");
    	// $('#lang-menu a.'+activeLanguage).addClass("hidden");

		//redirect
		window.location.replace("/de");

    }

    var initClicks = function(){
    	$("#lang-menu a").click( function(e){
    		e.preventDefault();
    		var lang = $(this).text();
    		gLanguage.setLanguage( lang );
    	});
    }


}//Language