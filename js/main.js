

"use strict";

$(document).ready(setup);

//obj    
var gEvents, gInput, gPlants, gLanguage, gCurrentPlantId;
var activeLanguage;
var imagesNames = ["amaranth","apple","apricot","asparagus","aubergine","basil","bay","beet","blackberry","blueberry","borage","broad_bean","broccoli","brussels_sprouts","carrot","cauliflower","celeriac","celery","cherry","chilli_pepper","chinese_cabbage","citrus_fruits","cucumber","currant","early_cabbage","fig","florence_fennel","garlic","ginger","globe_artichoke","gooseberry","horseradish","jerusalem_artichoke","kale","leek","lemon_balm","lettuce","marrow","nasturtium","nectarine","onion","parsnip","pea","peach","peanut","pear","plum","potato","quince","radish","raspberry","rhabarber","rose","rosemary","runner_bean","spinach","squash","staranis","strawberry","sweet_pepper","swiss_chard","tomato","walnut","wild_chamomile"];

function setup(){

	$("html").addClass('js').removeClass('no-js');

    gLanguage = new Language();
    gLanguage.init();

    gPlants = new Plants();
    gPlants.init();

    gEvents = new Events();
    gEvents.init();

    gInput = new Input();
    gInput.init();

    $('#new-plant').click(function(e) {
        var name = $('#new-plant-input').val();
        var id = name.toLowerCase().replace( / /g , "_");

        if(id.length < 3) return false;

        gPlantData.push(    {id:id,name:name,latin:"",note:"I'm new here."} );

        var msg = name + ' added!';
        console.log(msg);
        logger(msg);

    });


    $('#save').click(function(e) {

        var data = {relations: "var gRelationsData = "+JSON.stringify(gRelationsData)+";", plants: "var gPlantData = "+JSON.stringify(gPlantData)+";"};

        var request = $.ajax({
            url: "./writefile.php",
            type: "post",
            data: data
        });

        request.done(function (response, textStatus, jqXHR){
            console.log(response);
            logger(response);
        });
        // request.fail(function (jqXHR, textStatus, errorThrown){
        //     console.error(
        //         "The following error occurred: "+
        //         textStatus, errorThrown
        //     );
        // });

        // request.always(function () {
        // });
        
    });

 //    //load from hash
	gEvents.loadFromHash(window.location.hash);
}


function resetEvents(){

        $('#plant-note').off("change").on("change", function(e){
            var val = $(this).val();
            gPlantData[ getCurrentPlantIndex() ].note = val;
            console.log(gPlantData[getCurrentPlantIndex()]);
        });

        $('.edit-cell textarea').off("change").on("change",function(e){
            var elem = $(this);
            var val = elem.val();
            var id = elem.closest('.edit-cell').data('id');

            var index = getRelationsIndex(id);
            
            gRelationsData[index].comment = val;
                
            console.log(gRelationsData[index]);
        });

        $('.edit-cell .change').off("click").on("click", function(e){
            e.preventDefault();

            var elem = $(this);
            var cell = $(this).closest('.edit-cell');
            var id = cell.data('id');
            var state = cell.data('state');
            var index = getRelationsIndex(id);
            
            if(state=='' || state == undefined ) state='good';
            else if(state=='good') state='bad';
            else if(state=='bad') state='';

            cell.data('state', state).removeClass('bad good').addClass(state);

            gRelationsData[index].state = state;
                
            console.log(gRelationsData[index]);
        });

        $('.edit-cell .delete').off("click").on("click", function(e){
            e.preventDefault();
            var elem = $(this);
            var cell = $(this).closest('.edit-cell');
            var id = cell.data('id');
            var index = getRelationsIndex(id);
            gRelationsData.splice(index,1);
            cell.remove();
        });

        $('#add-rel').off("click").on("click", function(e){
            e.preventDefault();
            //sort by id
            gRelationsData.sort(function(a, b) {
                return parseFloat(a.id) - parseFloat(b.id);
            });
            //get highest id +1 
            var id = gRelationsData[ gRelationsData.length-1 ].id + 1;
            var plant2 = $('#select-plant').val();

            var relation = {id:id,plant1:gCurrentPlantId,plant2:plant2,state:"good",comment:""};
            gRelationsData.push(relation);
            var suggestion = {id:gCurrentPlantId};

            var html = gPlants.getOneRelation(relation, suggestion);

            $(this).closest('.edit-cell').before(html);
            resetEvents();
        });
}

function getCurrentPlantIndex() {
    return gPlantData.findIndex( function(x){return x.id == gCurrentPlantId} );
}

function getRelationsIndex(id){
    //might not be nessesary but to be sure
    return gRelationsData.findIndex( function(x){ return x.id == id} );
}

function hasImage(id) {
    return $.inArray(id, imagesNames) > -1;
}

function plantReady(id,note){
    if(gPlants.isAdmin) return true;
    if( !hasImage(id) || !note ) return false;
    else return true;
}

function logger(msg){
    $('#log').text(msg);
}
