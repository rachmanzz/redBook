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
		var getQuery='';
		if(/^SELECT [\w\d*]+ FROM [\w\W\d\s]+/.test(select)){
			getQuery =  (select.match(/^SELECT [\w\d*]+ FROM ([\w\W\d\s]+)/))[1];
		}
		select='SELECT '+sel+' FROM '+getQuery;
	};
	this.getSelect = function(){
		return select;
	};
	this.setTable = function(table){
		var getQuery='';
		if(typeof this.getTable == "undefined"){
			getQuery=/^SELECT [\w\d*]+ FROM [\w\d\s]+/.test(select)?
				(select.match(/^SELECT [\w\d*]+ FROM ([\w\W\d\s]+)/))[1]:'';
		}else{
			getQuery=/^SELECT [\w\d*]+ FROM [\w\d]+ [\w\W\d\s]+/.test(select)?
				(select.match(/^SELECT [\w\d*]+ FROM [\w\d]+ ([\w\W\d\s]+)/))[1]:'';
		}
		table = (select.match(/^(SELECT [\w\d*]+ FROM )/))[1]+table;
		select = table + getQuery;
	};
	this.rawQuery = function (getSelect) {
		select=getSelect(select);
	};
	this.setQuery = function(query){
		select = select + ' '+query;
	};
	return this;
};
redBook.prototype.table = function(setTable){
	this.setTable(setTable);
	this.getTable = setTable;
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
redBook.prototype.innerJoin = function (table,joindata) {
	if(typeof this.getTable != "undefined"){
		this.rawQuery(function (select) {
			var getQuery='';
			getQuery=/^SELECT [\w\d*]+ FROM [\w\d]+ [\w\W\d\s]+/.test(select)?
				(select.match(/^SELECT [\w\d*]+ FROM [\w\d]+ ([\w\W\d\s]+)/))[1]:'';
			var join = (select.match(/^(SELECT [\w\d*]+ FROM [\w\d]+)/))[1]+' INNER JOIN '+ table +
				' ON '+joindata + ' ' + getQuery;
			return join;
		});
	}
	return this;
};
redBook.prototype.leftJoin = function (table,joindata) {
	if(typeof this.getTable != "undefined"){
		this.rawQuery(function (select) {
			var getQuery='';
			getQuery=/^SELECT [\w\d*]+ FROM [\w\d]+ [\w\W\d\s]+/.test(select)?
				(select.match(/^SELECT [\w\d*]+ FROM [\w\d]+ ([\w\W\d\s]+)/))[1]:'';
			var join = (select.match(/^(SELECT [\w\d*]+ FROM [\w\d]+)/))[1]+' LEFT JOIN '+ table +
				' ON '+joindata + ' ' + getQuery;
			return join;
		});
	}
	return this;
};
redBook.prototype.rightJoin = function (table,joindata) {
	if(typeof this.getTable != "undefined"){
		this.rawQuery(function (select) {
			var getQuery='';
			getQuery=/^SELECT [\w\d*]+ FROM [\w\d]+ [\w\W\d\s]+/.test(select)?
				(select.match(/^SELECT [\w\d*]+ FROM [\w\d]+ ([\w\W\d\s]+)/))[1]:'';
			var join = (select.match(/^(SELECT [\w\d*]+ FROM [\w\d]+)/))[1]+' RIGHT JOIN '+ table +
				' ON '+joindata + ' ' + getQuery;
			return join;
		});
	}
	return this;
};
redBook.prototype.fullJoin = function (table,joindata) {
	if(typeof this.getTable != "undefined"){
		this.rawQuery(function (select) {
			var getQuery='';
			getQuery=/^SELECT [\w\d*]+ FROM [\w\d]+ [\w\W\d\s]+/.test(select)?
				(select.match(/^SELECT [\w\d*]+ FROM [\w\d]+ ([\w\W\d\s]+)/))[1]:'';
			var join = (select.match(/^(SELECT [\w\d*]+ FROM [\w\d]+)/))[1]+' FULL OUTER JOIN '+ table +
				' ON '+joindata + ' ' + getQuery;
			return join;
		});
	}
	return this;
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
redBook.prototype.logger = function () {
	console.log(this.getSelect());
};
module.exports = redBook;