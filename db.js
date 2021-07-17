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
  logging: false,
  define: {timestamps: false}
})

sequelize.authenticate()
  .then( function(success) {
    console.log('Connection has been established successfully.')

    //tables automatically have plueral names of these singular models unless told otherwise

    const Questions = sequelize.define('Question', {
      question_id: {type: DataTypes.INTEGER, primaryKey: true},
      product_id: {type: DataTypes.INTEGER},
      question_body: {type: DataTypes.TEXT},
      question_date: {type: DataTypes.BIGINT}, //will need to convert
      asker_name: {type: DataTypes.STRING},
      asker_email: {type: DataTypes.STRING},
      question_helpfulness: {type: DataTypes.INTEGER},
      reported: {type: DataTypes.BOOLEAN} // comes in as tinyint 0 or 1
    },{
      tableName: "Questions"
    });

    const Answers = sequelize.define('Answer', {
      answer_id: {type: DataTypes.INTEGER, primaryKey: true},
      question_id: {type: DataTypes.INTEGER}, //foreign key???????
      body: {type: DataTypes.TEXT},
      date: {type: DataTypes.BIGINT}, //will need to convert
      answerer_name: {type: DataTypes.STRING},
      answerer_email: {type: DataTypes.STRING},
      helpfulness: {type: DataTypes.INTEGER},
      reported: {type: DataTypes.BOOLEAN} //comes in as tinyint 0 or 1
    },{
      tableName: "Answers"
    });

    const Photos = sequelize.define('Photo', {
      id: {type: DataTypes.INTEGER, primaryKey: true},
      answer_id: {type: DataTypes.INTEGER}, //foreignkey?????
      url: {type: DataTypes.TEXT}
    },{
      tableName: "Photos"
    });


    //temporary tables for staging data before transformation

    const TemporaryQuestion = sequelize.define('TemporaryQuestion', {
      question_id: {type: DataTypes.INTEGER, primaryKey: true},
      product_id: {type: DataTypes.INTEGER},
      question_body: {type: DataTypes.TEXT},
      question_date: {type: DataTypes.BIGINT}, //will need to convert
      asker_name: {type: DataTypes.STRING},
      asker_email: {type: DataTypes.STRING},
      question_helpfulness: {type: DataTypes.INTEGER},
      reported: {type: DataTypes.BOOLEAN} // comes in as tinyint 0 or 1
    },{
      tableName: "TemporaryQuestions"
    })

    TemporaryQuestion.sync().then(sequelize.query(`COPY "TemporaryQuestions"(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) from '/Users/saralandis/VS Code Projects/hack reactor/questions-api/ETL Data/questions.csv' DELIMITER ',' CSV HEADER`));


    const TemporaryAnswer = sequelize.define('TemporaryAnswer', {
      id: {type: DataTypes.INTEGER, primaryKey: true},
      question_id: {type: DataTypes.INTEGER}, //foreign key???????
      body: {type: DataTypes.TEXT},
      date: {type: DataTypes.BIGINT}, //will need to convert
      answerer_name: {type: DataTypes.STRING},
      answerer_email: {type: DataTypes.STRING},
      helpfulness: {type: DataTypes.INTEGER},
      reported: {type: DataTypes.BOOLEAN} //comes in as tinyint 0 or 1
    },{
      tableName: "TemporaryAnswers"
    })

    TemporaryAnswer.sync().then(sequelize.query(`COPY "TemporaryAnswers"(id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness) from '/Users/saralandis/VS Code Projects/hack reactor/questions-api/ETL Data/answers.csv' DELIMITER ',' CSV HEADER`))
  })
  .catch(function(error) {
    console.error('Unable to connect to the database:', error)
  })



/*
 foreign key setup?????
// 1:1
Organization.belongsTo(User, { foreignKey: 'owner_id' });
User.hasOne(Organization, { foreignKey: 'owner_id' });

// 1:M
Project.hasMany(Task, { foreignKey: 'tasks_pk' });
Task.belongsTo(Project, { foreignKey: 'tasks_pk' });
*/

//please fix