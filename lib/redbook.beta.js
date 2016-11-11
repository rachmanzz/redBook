 var mysql      = require('mysql');
 var redBook = function(dataInfo){
	 var mysqlRes = mysql;
	 var mysqlConnection = function(db){
		 return mysqlRes.createConnection(db);
	 }
	 this.connection = mysqlConnection(dataInfo);
	 this.getConnect = function(connection){
		 return connection.connect(function(err){
			 if(err) console.log('connection failed');
			 else console.log('connect to database');
		 });
	 }
	 var select = 'SELECT * FROM ';
	 this.setSelect = function(sel){
		 var Val =  (select.match(/SELECT ([\w\d*]+) FROM/))[1];
		 select=select.replace(Val,sel);
	 }
	 this.getSelect = function(){
		 return select;
	 }
	 this.setTable = function(table){
		 select = select + table;
	 }
	 this.setQuery = function(query){
		 select = select + ' '+query;
	 };
	 return this;
 };
 redBook.prototype.table = function(setTable){
	 this.getTable = setTable;
	 this.setTable(setTable);
	 return this;
 };
 redBook.prototype.select = function(select){
	 this.setSelect(select);
	 return this;
 };
 redBook.prototype.where = function(key,data){
	 if(/^SELECT [\w\d]+ FROM /.test(this.getSelect())) this.setQuery('WHERE '+key +' = ' +data);
	 return this;
 };
 redBook.prototype.andWhere = function(key,data){
	 if(/^SELECT [\w\d*]+ FROM [\w\d]+ [\w]+ [\w\d]+ = [\w\d]+/.test(this.getSelect())) this.setQuery('& WHERE '+key +' = ' +data);
	 return this;
 };
 
redBook.prototype.getRow = function(query){
	var connection = this.onConnection = this.connection;
	 this.getConnect(connection);
	 connection.query(this.selected, function(error, results, fields){
		typeof query == 'function' && query(error, results, fields);
	});
	return this;
};
 redBook.prototype.insert = function(data,response){
	 //called connection Create
	 var connection = this.connection;
	 typeof this.onConnection == 'undefined' && this.getConnect(connection);
	 connection.query('INSERT INTO users SET ?',data,function(err, result) {
		typeof response == 'function' && response(err, result);
		});
	 typeof this.onConnection == 'undefined' && connection.end();
 };
 redBook.prototype.delete = function(data,response){
	 //called connection Create
	 var connection = this.connection;
	 typeof this.onConnection == 'undefined' && this.getConnect(connection);
	 var query = (this.getSelect().match(/^(SELECT [\w\d*]+)/))[1];
	 query=this.getSelect().replace(query,'DELETE');
	 connection.query(query,data,function(err, result) {
		typeof response == 'function' && response(err, result);
		});
	typeof this.onConnection == 'undefined' && connection.end();
 };
 redBook.prototype.update = function(data,response){
	 //called connection Create
	 var connection = this.connection;
	 typeof this.onConnection == 'undefined' && this.getConnect(connection);
	 var query = (this.getSelect().match(/^(SELECT [\w\d*]+)/))[1];
	 query=this.getSelect().replace(query,'UPDATE');
	 connection.query(query,data,function(err, result) {
		typeof response == 'function' && response(err, result);
		});
	typeof this.onConnection == 'undefined' && connection.end();
 };

 module.exports = redBook;