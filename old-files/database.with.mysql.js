const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'max-node-course',
  password: 'rootuser',
})

module.exports = pool.promise()