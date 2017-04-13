"use strict";

var utility = (function(){

	var utility = {};

	//private members are not added to the utility object

	//public methods are added to the dataAccess object	
	utility.getDate = function(){
		var today = new Date();

		var dd = today.getDate();
		//January is 0!
		var mm = today.getMonth() + 1; 
		var yyyy = today.getFullYear();

		today = dd + '/' + mm + '/' + yyyy;
		return today;
	};

	//Will deselect all other rows. Only one at a time supported.
	utility.selectRow = function(id){
		$("#" + id).addClass('selected').siblings().removeClass('selected');
	};

	utility.enableButton = function(id){
		$("#"+id).removeAttr('disabled');
		$("#"+id).removeClass('disabled');
	}


	return utility;
})();