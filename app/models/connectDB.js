var mysql = require('mysql2');
var dbConfig = require('../config/db.config');
var connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE
});

connection.connect(error => {
    if(error){
        console.log('Unable to connect to database. Please check again.');
        return;
    }
    console.log('Successfully connected to the database!');
});

module.exports = connection;