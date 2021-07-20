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
    console.log('Connection has been established successfully.')

    //tables automatically have plueral names of these singular models unless told otherwise

    const Photo = sequelize.define('Photo', {
      id: {type: DataTypes.INTEGER, primaryKey: true},
      url: {type: DataTypes.TEXT}
    },{
      underscored: true,
      tableName: "Photos"
    })

    const Question = sequelize.define('Question', {
      id: {type: DataTypes.INTEGER, primaryKey: true},
      product_id: {type: DataTypes.INTEGER},
      question_body: {type: DataTypes.TEXT},
      question_date: {type: DataTypes.BIGINT}, //will need to convert on db query response
      asker_name: {type: DataTypes.STRING},
      asker_email: {type: DataTypes.STRING},
      question_helpfulness: {type: DataTypes.INTEGER},
      reported: {type: DataTypes.BOOLEAN} // comes in as tinyint 0 or 1
    },{
      underscored: true,
      tableName: "Questions"
    })


    const Answer = sequelize.define('Answer', {
      id: {type: DataTypes.INTEGER, primaryKey: true},
      body: {type: DataTypes.TEXT},
      date: {type: DataTypes.BIGINT}, //will need to convert???
      answerer_name: {type: DataTypes.STRING},
      answerer_email: {type: DataTypes.STRING},
      helpfulness: {type: DataTypes.INTEGER},
      reported: {type: DataTypes.BOOLEAN} //comes in as tinyint 0 or 1
    },{
      underscored: true,
      tableName: "Answers"
    })

    Answer.hasMany(Photo);
    Photo.belongsTo(Answer);

    Question.hasMany(Answer);
    Answer.belongsTo(Question);

    sequelize.sync({ force: true });

  })
  .catch(function(error) {
    console.error('DB Creation ERROR:', error)
  })



