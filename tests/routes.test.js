
const db = require("../database/index.js");
const request = require("supertest");
const app = require("../server/app.js");

afterAll(done => {
  done();
});


describe('Requests to /qa/questions', () => {
    test('GET all questions returns 200 status', async () => {
      const response = await request(app).get('/qa/questions').query({product_id: 1234});
      expect(response.statusCode).toBe(200);
    });

    test('GET all questions contains data', async () => {
      const response = await request(app).get('/qa/questions').query({product_id: 1234});
      expect(response.body).not.toBe(undefined);
    });
});


// describe('Requests to /qa/questions/:question_id/answers', () => {
//     test('GET all answers returns 200 status', async () => {
//       const response = await request(app).get('/qa/questions/:question_id/answers').params({question_id: 1});
//       expect(response.statusCode).toBe(200);
//     });

//     test('GET all answers contains data', async () => {
//       const response = await request(app).get('/qa/questions/:question_id/answers').params({question_id: 1});;
//       expect(response.body).not.toBe(undefined);
//     });
// });



'/qa/questions/:question_id/answers'