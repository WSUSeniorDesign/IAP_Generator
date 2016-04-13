// express
const app = require("../server").app;
const mongoose = require("mongoose");

// chai
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const chaiHttp = require("chai-http");
chai.use(chaiAsPromised);
chai.use(chaiHttp); 

// clean up the database and create dummy values for a specific model
function setupDb(model, dummies) {
  // clean database initially
  model.collection.drop();

  // set up database
  beforeEach(function(done) {
    if (dummies) {
      model.create(dummies, done);
    } else {
      done();
    }
  });

  // clean database each time
  afterEach(function (done) {
    model.collection.drop();
    done();
  });
}

module.exports = {
  app,
  chai,
  expect,
  setupDb
}