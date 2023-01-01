const {Sequelize} = require('sequelize')

let sequelize = new Sequelize('node','root','mysql',{
    host: 'localhost',
    dialect:'mysql'
})

module.exports = sequelize