const request = require('supertest');
const {
  AddFundsRequest,
} = require('@techlab25/backend-kiss/dtos/AddFundsRequest.js');

describe('GET /health', function () {
  it('respond 200', function (done) {
    console.log(AddFundsRequest);
    request('http://localhost:8080').get('/health').expect(200, done);
  });
});
