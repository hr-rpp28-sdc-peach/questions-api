const { Sequelize, Model, DataTypes } = require('sequelize')
require('dotenv').config();

const user = process.env.USER
const host = process.env.HOST
const database = process.env.DATABASE
const password = process.env.PASSWORD
const port = process.env.PORT

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'postgres',
  logging: false
})

sequelize.authenticate()
  .then( function(error) {
    console.log('Connection has been established successfully.')
    console.log(process.env.HOST)
  })
  .catch(function(error) {
    console.error('Unable to connect to the database:', error)
  })

