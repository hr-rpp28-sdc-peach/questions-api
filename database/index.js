const { Sequelize, Model, DataTypes } = require('sequelize');
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
  logging: false,
  define: {timestamps: false}
})

sequelize.authenticate()
  .then( function(success) {
    console.log('Database connection has been established successfully.')
  })
  .catch(function(error) {
    console.error('Unable to connect to the database:', error)
  })

// database 'response' functions

// send all questions (two at a time????)
// add question
// send answers
// add answer
// add photos ?????
// mark question helpful
// mark answer helpful
// report question
// report answer


