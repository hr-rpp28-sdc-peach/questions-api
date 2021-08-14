import http from 'k6/http';
import { sleep, check } from 'k6';


export let options = {
  stages: [
    { duration: '30s', target: 1}
    // { duration: '1m', target: 10}
    // { duration: '1m30s', target: 100}
    // { duration: '3m', target: 1000}
  ]
}

export default function () {
  for( var id = 1; id < 120; id++){
    // http.get(`http://localhost:3000/qa/questions/?product_id=${id}`, {
    //   tags: {name: 'getAnswers'}
    // });
    http.get(`http://localhost:3000/qa/questions/${id}/answers`, {
      tags: {name: 'getAnswers'}
    });
  }
  sleep(1);
}