// express
const app = require("../server").app;
const mongoose = require("mongoose");
const User = mongoose.model("User");

// chai
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp); 

// clean up the database and create dummy values for a specific model
function setupDb(model) {
  beforeEach(function(done) {
    model.collection.drop(function(){done();});
  });
};

module.exports = {
  app,
  chai,
  expect,
  setupDb
}