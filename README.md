# redBook
RedBook is mysql helper. redBook make script a simple and easy to use

##How to Use

      var redBook      = require('redbook');

  First, define resource of database
  
      var resInf={
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'dbname'
     };
     
     
##Example redbook function
  Get Row of table data

    new redBook(resInf).table('users').where('id',1).andWhere('group','mygroup').getRow(function (err,users) {
      if(typeof users != "undefined" && users.length >= 1){
        console.log(users);
      }
    });
    
  Inset Table
  
    new redBook(resInf).table('users').insert({name:'myname',groupID: 1});

  Update
  
    new redBook(resInf).table('users').updateRaw('gamestart=? WHERE groupID=?',['yes',1]);
    
  Delete
  
    new redBook(resInf).table('users').where('groupID',1).delete();
    
  Other Operator
    
    new redBook(resInf).table('users').where('groupID',1).operator('AND WHERE city LIKE "s%"')getRow(function (err,users) {
        // row result
    });
    
  Join
    
    new redBook(resInf).table('users').innerJoin('group','users.id = group.userid').where('users.money','>=',2000)
    .select('group.*, SUM(group.user) AS maxUser').getRow(function (err,users){
        // row result
    });

# Other function

    orWhere, orderBy, leftJoin,  rightJoin, fullJoin
    


    
    
