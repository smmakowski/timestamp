const request = require('request');
const chai = require('chai');
const expect = chai.expect;

describe('server', function() {
  describe('main page', function() {
    it('should respond to GET requests or / 200 status code', function() {
      request('http://127.0.0.1:3000/', function(error, response, body) {
        const bodyString = body.toString();
        expect(bodyString.search('<!DOCTYPE HTML>')).to.equal(true);
        done();
      });
    });
  });
  describe('timestamp microservice', function() {
    const validUnixQuery = 1450137600;
    const validNaturalQuery = 'December 15, 2015';
    const invalidUnixQuery = '14501a7600';
    const invalidNaturalQuery = 'dember15,202';

    describe('all queries', function() {
      it('should respond to GET requests for /timestamp/:date 200 status code', function(done) {
        request('http://127.0.0.1:3000/timestamp/' + validUnixQuery, function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });

      it('should send back parsable stringified JSON', function(done) {
        request('http://127.0.0.1:3000/timestamp/' + validUnixQuery, function(error, response, body) {
          expect(JSON.parse.bind(this, body)).to.not.throw();
          done();
        });
      });

      it('should send back an object', function(done) {
        request('http://127.0.0.1:3000/timestamp/' + validUnixQuery, function(error, response, body) {
          var parsedBody = JSON.parse(body);
          expect(parsedBody).to.be.an('object');
          done();
        });
      });
      it('sent object should have properties "unix" and "natural"', function(done) {
        request('http://127.0.0.1:3000/timestamp/' + validUnixQuery, function(error, response, body) {
          var parsedBody = JSON.parse(body);
          expect(parsedBody).to.have.keys('natural', 'unix');
          done();
        });
      });
    });
    describe('valid queries', function() {
      it('should return an object with appropriate values for unix and natural properties', function(done) {
        request('http://127.0.0.1:3000/timestamp/' + validUnixQuery, function(error, response, body) {
          var parsedBody = JSON.parse(body);
          expect(parsedBody.natural).to.equal('December 15, 2015');
          expect(parsedBody.unix).to.equal(1450137600);

        });
        request('http://127.0.0.1:3000/timestamp/' + validNaturalQuery, function(error, response, body) {
          var parsedBody = JSON.parse(body);
          expect(parsedBody.natural).to.equal('December 15, 2015');
          expect(parsedBody.unix).to.equal(1450166400);
          done();
        });
      });
    });
    describe('invalid queries', function() {
      it('should return an object with null values for unix and natural properties', function(done) {
        request('http://127.0.0.1:3000/timestamp/' + invalidUnixQuery, function(error, response, body) {
          var parsedBody = JSON.parse(body);
          expect(parsedBody.natural).to.equal(null);
          expect(parsedBody.unix).to.equal(null);

        });
        request('http://127.0.0.1:3000/timestamp/' + invalidNaturalQuery, function(error, response, body) {
          var parsedBody = JSON.parse(body);
          expect(parsedBody.natural).to.equal(null);
          expect(parsedBody.unix).to.equal(null);
          done();
        });
      });
    })
  });
});
