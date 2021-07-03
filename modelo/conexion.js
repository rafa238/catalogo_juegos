const mysql = require('mysql'); 

module.exports = () =>{
    return mysql.createConnection({
        host: "localhost",
        user:"root",
        password : "burr0510",
        database: "db_catalogovg"
    });
}