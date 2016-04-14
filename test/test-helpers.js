// express
const app = require("../server").app;
const mongoose = require("mongoose");

// chai
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp); 

// clean up the database and create dummy values for a specific model
function setupDb(model, dummies) {
  beforeEach(function(done) {
    model.collection.drop(function() {
      if (dummies) {
        model.create(dummies, done);
      } else {
        done();
      }
    });
  });
}

module.exports = {
  app,
  chai,
  expect,
  setupDb
}