var mysql      = require('mysql');
var redBook = function(dataInfo){
	this.Res =dataInfo;
	this.getConnect = function(connection){
		return connection.connect(function(err){
			if(err) console.log('connection failed');
			else console.log('connect to database');
		});
	};
	var select = 'SELECT * FROM ';
	this.setSelect = function(sel){
		var Val =  (select.match(/SELECT ([\w\d*]+) FROM/))[1];
		select=select.replace(Val,sel);
	};
	this.getSelect = function(){
		return select;
	};
	this.setTable = function(table){
		select = select + table;
	};
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
redBook.prototype.where = function(key,arg,arg2){
	var operator = typeof arg2 != "undefined" ? arg : '=';
	var data = typeof arg2 != "undefined" ? arg2 : arg;
	if(/^SELECT [\w\d*]+ FROM /.test(this.getSelect())) this.setQuery('WHERE '+key + ' ' + operator + ' ' +mysql.escape(data));
	return this;
};

redBook.prototype.andWhere = function(key,arg,arg2){
	var operator = typeof arg2 != "undefined" ? arg : '=';
	var data = typeof arg2 != "undefined" ? arg2 : arg;
	if(/^SELECT [\w\d*]+ FROM [\w\d]+ [\w]+ [\w\d]+ = [\w\d]+/.test(this.getSelect())) this.setQuery(' AND '+key + ' ' + operator + ' ' +mysql.escape(data));
	return this;
};
redBook.prototype.orWhere = function(key,arg,arg2){
	var operator = typeof arg2 != "undefined" ? arg : '=';
	var data = typeof arg2 != "undefined" ? arg2 : arg;
	if(/^SELECT [\w\d*]+ FROM [\w\d]+ [\w]+ [\w\d]+ = [\w\d]+/.test(this.getSelect())) this.setQuery(' OR '+key + ' ' + operator + ' ' +mysql.escape(data));
	return this;
};
redBook.prototype.orderBy = function (arg,arg2) {
	var data = typeof arg2 != "undefined" ? mysql.escape(arg) + ' ' + arg2 : mysql.escape(arg);
	this.setQuery(' ORDER BY '+ data);
};
redBook.prototype.operator = function (arg) {
	this.setQuery(' '+ arg);
};
redBook.prototype.getRow = function(query){
	var connection = mysql.createConnection(this.Res);
	this.getConnect(connection);
	var q=connection.query(this.getSelect(), function(error, results, fields){
		connection.end();
		typeof query == 'function' && query(error, results, fields);
	});
	return q;

};
redBook.prototype.end=function () {
	this.connection.end();
};
redBook.prototype.insert = function(data,response){
	var connection = mysql.createConnection(this.Res);
	this.getConnect(connection);
	var q=connection.query('INSERT INTO '+this.getTable+' SET ?',data,function(err, result) {
		typeof response == 'function' && response(err, result);
	});
	connection.end();
};
redBook.prototype.delete = function(response){
	var connection = mysql.createConnection(this.Res);
	this.getConnect(connection);
	var query = (this.getSelect().match(/^(SELECT [\w\d*]+)/))[1];
	query=this.getSelect().replace(query,'DELETE');
	connection.query(query,function(err, result) {
		typeof response == 'function' && response(err, result);
	});
	connection.end();
};
redBook.prototype.updateRaw = function(key,Index,response){
	//called connection Create
	var connection = mysql.createConnection(this.Res);
	this.getConnect(connection);
	connection.query('UPDATE '+this.getTable+' SET '+key,Index,function(err, result) {
		typeof response == 'function' && response(err, result);
	});
	connection.end();
};

module.exports = redBook;