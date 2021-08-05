const express = require('express');
const app = express();
const port = 3000;
const db = require('../database/index.js');
const bodyParser = require('body-parser')

app.use(bodyParser.json())

// get all questions
app.get('/qa/questions', function(req, res) {
  var product_id = req.query.product_id;
  var pageSize = req.query.pageSize? parseInt(req.query.pageSize) : 5;
  var page = req.query.page? parseInt(req.query.page) : 0;

  return db.getQuestions(product_id, page, pageSize)
    .then( (questions) => {
      console.log("Successfully got ALL questions");
      var nonReportedQuestions = questions.filter((question) => !question.reported);
      res.status(200).send(nonReportedQuestions)
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
  var pageSize = req.query.pageSize? parseInt(req.query.pageSize) : 5;
  var page = req.query.page? parseInt(req.query.page) : 0;
  return db.getAnswers(question_id, page, pageSize)
    .then( (answers) => {
      console.log("Successfully got ALL answers")
      var nonReportedAnswers = answers.filter((answer) => !answer.reported);
      res.status(200).send(nonReportedAnswers)
    })
    .catch ((error) => {
      res.status(500).send(error)
    })
})

// add answer
app.post('/qa/questions/:question_id/answers', bodyParser.urlencoded(),  function(req, res) {
  return db.addAnswer(req)
  .then((answerAdded) => {
    console.log("Successfully added answer", answerAdded)
    res.status(200).send(answerAdded);
  })
  .catch((error) => {
    console.log("Failed to add answer")
    res.status(500).send(error);
  })
})

// // get photos????????????????????????????????????????????????????????????????????????????????????????????????????????????

// //add photo to answer ???????????????????????????????????????????????????????????????????????????????????????????????????
// app.post('ROUTE',bodyParser.urlencoded(), function(req, res) {
//   return db.addPhoto(req)
//   .then((photoAdded) => {
//     console.log("Successfully added photo", photoAdded)
//     res.status(200).send(photoAdded);
//   })
//   .catch((error) => {
//     console.log("Failed to add photo")
//     res.status(500).send(error);
//   })
// })

// mark question helpful
app.put('/qa/questions/:question_id/helpful', function(req, res) {
  return db.updateQuestionHelpfulness(req.params.question_id)
  .then((questionHelpUpdated) => {
    console.log("Successfully updated question helpfulness", questionHelpUpdated)
    res.status(200).send(questionHelpUpdated);
  })
  .catch((error) => {
    console.log("Failed to update question helpfulness")
    res.status(500).send(error);
  })
})

// mark answer helpful
app.put('/qa/answers/:answer_id/helpful', function(req, res) {
  return db.updateAnswerHelpfulness(req.params.answer_id)
  .then((answerHelpUpdated) => {
    console.log("Successfully updated answer helpfulness", answerHelpUpdated)
    res.status(200).send(answerHelpUpdated);
  })
  .catch((error) => {
    console.log("Failed to update answer helpfulness")
    res.status(500).send(error);
  })
})

// report question
app.put('/qa/questions/:question_id/report', function(req, res) {
  return db.reportQuestion(req.params.question_id)
  .then((questionReported) => {
    console.log("Successfully reported question", questionReported)
    res.status(200).send(questionReported);
  })
  .catch((error) => {
    console.log("Failed to report question")
    res.status(500).send(error);
  })
})

// report answer
app.put('/qa/answers/:answer_id/report', function(req, res) {
  return db.reportAnswer(req.params.answer_id)
  .then((answerReported) => {
    console.log("Successfully reported answer", answerReported)
    res.status(200).send(answerReported);
  })
  .catch((error) => {
    console.log("Failed to report answer")
    res.status(500).send(error);
  })
})

module.exports = app;


