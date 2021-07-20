const express = require('express');
const app = express();
const port = 3000;
const db = require('../database/index.js');
const bodyParser = require('body-parser')

app.use(bodyParser.json())

// get all questions
app.get('/qa/questions', function(req, res) {
  console.log('MUST CREATE RESPONSE')
  //res.send
})

// add question
app.post('/qa/questions', function(req, res) {
  console.log('MUST CREATE RESPONSE')
  //res.send
})

// get answers
app.get('/qa/questions/:question_id/answers', function(req, res) {
  console.log('MUST CREATE RESPONSE')
  //res.send
})

// add answer
app.post('/qa/questions/:question_id/answers', function(req, res) {
  console.log('MUST CREATE RESPONSE')
  //res.send
})


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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})