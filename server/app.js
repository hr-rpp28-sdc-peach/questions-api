const express = require('express');
const app = express();
const port = 3000;
const db = require('../database/index.js');
const bodyParser = require('body-parser')

app.use(bodyParser.json())

// get all questions
app.get('/qa/questions', function(req, res) {
  var product_id = req.query.product_id;
  var count = req.query.count? parseInt(req.query.count) : 5;
  var page = req.query.page? parseInt(req.query.page) : 1;

  return db.getQuestions(product_id, count, page)
    .then( (questions) => {
      console.log("Successfully got questions", questions)
      res.status(200).send(questions)
    })
    .catch ((error) => {
      console.log("Failed to get questions")
      res.status(500).send(error)
    })
  // then run filtering?
})

// add question
app.post('/qa/questions', bodyParser.urlencoded(), function(req, res) {
  return db.addQuestion(req.body)
    .then((questionAdded) => {
      console.log("Successfully added question", questionAdded)
      res.status(201).send(questionAdded);
    })
    .catch((error) => {
      console.log("Failed to add question")
      res.status(500).send(error);
    })
})

// get answers
app.get('/qa/questions/:question_id/answers', bodyParser.json(), function(req, res) {
  var question_id = req.params.question_id;
  var count = req.query.count? parseInt(req.query.count) : 5;
  var page = req.query.page? parseInt(req.query.page) : 1;
  return db.getAnswers(question_id, count, page)
    .then( (answers) => {
      res.status(200).send(answers)
    })
    .catch ((error) => {
      res.status(500).send(error)
    })
})

// add answer
app.post('/qa/questions/:question_id/answers', function(req, res) {
  console.log('MUST CREATE RESPONSE')
  //res.send
})

// get photos?

//add photo to answer
app.post('ROUTE', function(req, res) { // would this be a put????
  console.log('MUST CREATE RESPONSE')
  //res.send
})

// mark question helpful
app.put('/qa/questions/:question_id/helpful', function(req, res) {
  console.log('MUST CREATE RESPONSE')
  //res.send
})

// mark answer helpful
app.put('/qa/answers/:answer_id/helpful', function(req, res) {
  console.log('MUST CREATE RESPONSE')
  //res.send
})

// report question
app.put('/qa/questions/:question_id/report', function(req, res) {
  console.log('MUST CREATE RESPONSE')
  //res.send
})

// report answer
app.put('/qa/answers/:answer_id/report', function(req, res) {
  console.log('MUST CREATE RESPONSE')
  //res.send
})

module.exports = app;


