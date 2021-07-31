const { Sequelize, Model, DataTypes } = require('sequelize');
const {Question, Answer, Photo} = require('./dbCreate.js')
require('dotenv').config();

const user = process.env.USER;
const host = process.env.HOST;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;
const port = process.env.PORT;

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
const getQuestions = (product_id, page, count) => {
  return Question.findAll({
    where:{
      product_id: product_id
    }});
}
// add question

const addQuestion = (questionInfo) => {

  return Question.create({
    asker_name: questionInfo.asker_name,
    question_body: questionInfo.question_body,
    asker_email: questionInfo.asker_email,
    product_id: questionInfo.product_id,
    question_date: Math.floor(Date.now()/1000),
    question_helpfulness: 0,
    reported: 0
  })
}


// send answers
const getAnswers = (question_id, page, count) => {
  return Answer.findAll({
    where:{
      question_id: question_id
    }});
}
// add answer

const addAnswer = (answerInfo) => {
  console.log('Question ID', answerInfo.params.question_id);
  return Answer.create({
    question_id: answerInfo.params.question_id,
    body: answerInfo.body.body,
    date: Math.floor(Date.now()/1000),
    answerer_name: answerInfo.body.answerer_name,
    answerer_email: answerInfo.body.answerer_email,
    helpfulness: 0,
    reported: 0
  })
}


// add photos ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????

// mark question helpful
const updateQuestionHelpfulness = (question_id) => {
  let questionIDInt = Number(question_id);
  return Question.increment('question_helpfulness', {by: 1, where: {id: questionIDInt}})
}

// mark answer helpful
const updateAnswerHelpfulness = (answer_id) => {
  let answerIDInt = Number(answer_id);
  return Answer.increment('helpfulness', {by: 1, where: {id: answerIDInt}})
}
// report question

const reportQuestion = () => {

}
// report answer

const reportAnswer = () => {

}


module.exports = {getQuestions, getAnswers, addQuestion, addAnswer, updateQuestionHelpfulness, updateAnswerHelpfulness, reportQuestion, reportAnswer}