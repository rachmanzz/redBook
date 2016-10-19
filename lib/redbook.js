var redBook = function(dbinfo){
	var mysql      = require('mysql');
	this.connection = mysql.createConnection(dbinfo);
	return this;
};
redBook.prototype.TABLE	 = function(table){
	this.getTable	= table;
	this.connection.connect(function(err){
		if(err){
			console.error('error connecting: ' + err.stack);
		}else{
			console.log('database connected');
		}
	});
	return this;
};
redBook.prototype.SELECT = function(select){
	this.selected = 'SELECT '+select+' FROM '+this.getTable;
	return this;
};
redBook.prototype.WHERE = function(where){
	this.selected = this.selected + ' WHERE ' + where;
	return this;
};
redBook.prototype.INSERT = function(data,response){
	var query = this.connection.query('INSERT INTO '+this.getTable+' SET ?',data,function(err, result) {
		typeof response == 'function' && response(err, result);
	});
};
redBook.prototype.DESTROY = function(){
	this.connection.destroy();
};
module.exports = redBook;