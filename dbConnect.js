var mysql = require('mysql');
var connecction = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'fintech'
});

connecction.connect();
/*
connecction.query('SELECT * FROM user', function(error, results, fields) {
    if(error) throw error;
    for(var i=0;i<results.length;i++) {
        console.log('The user is: ', results[i]);
    }
});
*/