const express = require('express');
const app = express();
const port = 3000;
const db = require('../database/index.js');
const bodyParser = require('body-parser');
const redis = require('redis');
const redisClient = redis.createClient({ host: '172.31.84.31', port: 6379 })

app.use(bodyParser.json())


app.use(express.static('public'));

const cache = (req, res, next) => {

  let product_id = Number(req.query.product_id);
  let question_id = Number(req.params.question_id);

  if (product_id) {
    let key = `ProductID ${product_id}`

    redisClient.get(key, (err, data) => {
      if (err) throw err;

      if (data !== null) {
        console.log('found productID in cache')
        res.send(JSON.parse(data))
      } else {
        next()
      }
    })
  }

  if (question_id) {
    let key = `QuestionID ${question_id}`;

    redisClient.get(key, (err, data) => {
      if (err) throw err;

      if (data !== null) {
        console.log('found questionID in cache')
        res.send(JSON.parse(data))
      } else {
        next()
      }
    })
  }
}



// get all questions
app.get('/qa/questions', async function(req, res) {
  try {
    var product_id = req.query.product_id;
    var pageSize = req.query.pageSize? parseInt(req.query.pageSize) : 5;
    var page = req.query.page? parseInt(req.query.page) : 0;
    const questions = await db.getQuestions(product_id, page, pageSize)

    console.log("Successfully got ALL questions");
    let finalFormattedQuestions = [];
    const nonReportedQuestions = questions.filter((question) => !question.reported);
    for (let i = 0; i < nonReportedQuestions.length; i++) {
      const question = nonReportedQuestions[i];

      var formattedAnswers = {};

      const nonReportedAnswers = await db.getAnswers(question.dataValues.id, page, pageSize)
      for (let j = 0; j < nonReportedAnswers.length; j++) {
        const answer = nonReportedAnswers[j];
        const photos = await db.getPhotos(answer.dataValues.id)
        var formattedPhotos = []
        photos.forEach((photo) => {
          var photoObject = {};
          photoObject.id = photo.dataValues.id;
          photoObject.url = photo.dataValues.url;
          formattedPhotos.push(photoObject);
        });

        var finalAnswer = {
          id: answer.dataValues.id,
          body: answer.dataValues.body,
          date: new Date(Number(answer.dataValues.date)).toISOString(),
          answerer_name: answer.dataValues.answerer_name,
          helpfulness: answer.dataValues.helpfulness,
          photos: formattedPhotos
        }
        formattedAnswers[answer.dataValues.id] = finalAnswer;

        var finalQuestion = {
          question_id: question.dataValues.id,
          question_body: question.dataValues.question_body,
          question_date: new Date(Number(question.dataValues.question_date)).toISOString(),
          asker_name: question.dataValues.asker_name,
          question_helpfulness: question.dataValues.question_helpfulness,
          reported: question.dataValues.reported,
          answers: formattedAnswers
        }
        console.log('FINAL QUESTION', finalQuestion);
        finalFormattedQuestions.push(finalQuestion);
      }
    }
    var properlyFormattedQuestionsAnswersPhotos = {
      product_id,
      results: finalFormattedQuestions
    }
  var key = `ProductID ${product_id}`
  redisClient.setex(key, 3000, JSON.stringify(properlyFormattedQuestionsAnswersPhotos));
  res.status(200).send(properlyFormattedQuestionsAnswersPhotos);
  }
  catch (error) {
    console.log("Failed to get questions")
    res.status(500).send(error)
  }
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
app.get('/qa/questions/:question_id/answers', bodyParser.json(), async function(req, res) {
  try {
    var question_id = req.params.question_id;
    var pageSize = req.query.pageSize? parseInt(req.query.pageSize) : 5;
    var page = req.query.page? parseInt(req.query.page) : 0;

    var formattedAnswers = {};

    const nonReportedAnswers = await db.getAnswers(question_id, page, pageSize)
    console.log("Successfully got ALL answers");
    for (let j = 0; j < nonReportedAnswers.length; j++) {
      const answer = nonReportedAnswers[j];

      const photos = await db.getPhotos(answer.dataValues.id)

      var formattedPhotos = []
      photos.forEach((photo) => {
        var photoObject = {};
        photoObject.id = photo.dataValues.id;
        photoObject.url = photo.dataValues.url;
        formattedPhotos.push(photoObject);
      });

      var finalAnswer = {
        answer_id: answer.dataValues.id,
        body: answer.dataValues.body,
        date: new Date(Number(answer.dataValues.date)).toISOString(),
        answerer_name: answer.dataValues.answerer_name,
        helpfulness: answer.dataValues.helpfulness,
        photos: formattedPhotos
      }
      formattedAnswers[answer.dataValues.id] = finalAnswer;
    }

    var properlyFormattedAnswersPhotos = {
      question_id,
      page,
      count: pageSize,
      results: formattedAnswers
    }

    var key = `QuestionID ${question_id}`;
    redisClient.setex(key, 3000, JSON.stringify(properlyFormattedAnswersPhotos));
    res.status(200).send(properlyFormattedAnswersPhotos);
  }
  catch (error){
    res.status(500).send(error)
  }
})

// add answer
app.post('/qa/questions/:question_id/answers', bodyParser.urlencoded(),  function(req, res) {

  if(req.body.photos){
    var photoUrls = req.body.photos.split(",")
  }

  return db.addAnswer(req)
  .then((answerAdded) => {
    console.log("Successfully added answer", answerAdded)
    if (!photoUrls){
      res.status(200).send(answerAdded);
    } else {
      console.log('🥳', answerAdded.dataValues.id)
      console.log('🤖', photoUrls)
      return db.addPhotos(answerAdded.dataValues.id, photoUrls)
      .then((savedPhotos) => {
        res.status(200).send(savedPhotos);
      })
      .catch ((error) => {
        console.log(error)
        res.status(500).send(error);
      })
    }
  })
  .catch((error) => {
    console.log("Failed to add answer")
    res.status(500).send(error);
  })
})


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