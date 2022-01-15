"use strict";

var dataAccess = (function(){
	
	var dataAccess = {};

	//private members are not added to the dataAccess object
	var db = initDb();

	function initDb(){
		//db name, version, comment, size (10MB)
		var db = openDatabase('xPenceTrackerDb', '0.1', 'DB for the xPence tracker app', 10 * 1024 * 1024);	
		db.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS Item (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, " + 
				"price REAL, comment TEXT, createdOn TEXT)");
			tx.executeSql("CREATE TABLE IF NOT EXISTS Consumption (id INTEGER PRIMARY KEY AUTOINCREMENT, itemId INTEGER, " + 
				"quantity INTEGER, comment TEXT, createdOn TEXT, FOREIGN KEY (itemId) REFERENCES Item (id))");			
		});	

		return db;
	};

	//public methods are added to the dataAccess object	
	dataAccess.insertItemToDb = function(name, price, comment){
		//write value to db
		db.transaction(function(tx){
			var insert = "INSERT INTO Item (name, price, comment, createdOn) VALUES(?,?,?,?)";
			tx.executeSql(insert, [name, price, comment, utility.getDate()]);
		});		
		console.log('New item inserted. name: ' + name + ' price: ' + price);
	};

	//Async method needs a success callback function to perform computation on the result set.
	dataAccess.getAllItemsFromDb = function(renderFunc){
		//read value form db
		db.transaction(function(tx){
			tx.executeSql('SELECT id, name, price, comment FROM Item', [], renderFunc);
		});
	};

	//Async method needs a success callback function to perform computation on the result set.
	dataAccess.getAllConsumptionsFromDb = function(renderFunc){		
		db.transaction(function(tx){
			var innerJoin = "SELECT c.id as id, i.name as name, i.price as price FROM " +
								"Consumption c INNER JOIN Item i ON c.itemId = i.id";
			tx.executeSql(innerJoin, [], renderFunc);
		});
	};

	dataAccess.getTotal = function(renderFunc){
		db.transaction(function(tx){
			var query = "SELECT SUM(i.price) as total FROM Consumption c INNER JOIN Item i ON c.itemId = i.id";
			tx.executeSql(query, [], renderFunc);
		});
	};

	//Consumption quantity is 1 by now. Comment is not yet supported.
	dataAccess.insertConsumptionToDb = function(itemId){
		db.transaction(function (tx) {  
			var insert = "INSERT INTO Consumption (itemId, quantity, createdOn) VALUES(?,?,?)";
			tx.executeSql(insert, [itemId, 1, utility.getDate()]);			
		});	
		console.log('New xpence performed (1). itemId: ' + itemId);
	};

	//test only!
	dataAccess.resetItems = function(){
		db.transaction(function(tx){
			tx.executeSql("DROP TABLE Item", function() {
			      alert("Item table has been dropped."); 
			});
		});
	};

	return dataAccess;
})();