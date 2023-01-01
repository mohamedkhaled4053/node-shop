let mysql = require('mysql2')

let pool =mysql.createPool({
    host:'localhost',
    user: 'root',
    database: 'node',
    password :'mysql'
})

module.exports = pool.promise()