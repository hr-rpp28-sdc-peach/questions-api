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
  .then(console.log('Connection has been established successfully.'))

  .then(() => {
    return sequelize.query(`COPY "Questions"(id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) from '/Users/saralandis/VS Code Projects/hack reactor/questions-api/ETL Data/questions.csv' DELIMITER ',' CSV HEADER`)
  })

  .then(() => {
    return sequelize.query(`COPY "Answers"(id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness) from '/Users/saralandis/VS Code Projects/hack reactor/questions-api/ETL Data/answers.csv' DELIMITER ',' CSV HEADER`)
  })


  .then(() => {
    return sequelize.query(`COPY "Photos"(id, answer_id, url) from '/Users/saralandis/VS Code Projects/hack reactor/questions-api/ETL Data/answers_photos.csv' DELIMITER ',' CSV HEADER`)
  })


  .catch(function(error) {
    console.error('Unable to connect to the database:', error)
  })