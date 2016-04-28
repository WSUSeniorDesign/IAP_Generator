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
var testUser = null;
function setupDb(model, dummies) {
  beforeEach(function(done) {
    if (testUser !== null) { return done(); }

    User.collection.drop(function() {
      var values = {
        name: "Tester",
        username: "tester",
        email: "test@test.test",
        phoneNumber: "1-800-TEST-THIS",
        password: "test",
        role: "admin"
      };
      User.create(values, function (err, doc) {
        if (err) return done(err);
        testUser = doc;
        done();
      });
    });
  });

  beforeEach(function(done) {
    model.collection.drop(function() {
      if (dummies) {
        for (var i = 0; i < dummies.length; i++) {
          dummies[i].user = testUser;
        }
        try {
          model.create(dummies, done);
        } catch (err) {
          console.log(err);
          done(err);
        }
      } else {
        done();
      }
    });
  });

  afterEach(function(done){
    testUser = null;
    done();
  })
}

module.exports = {
  app,
  chai,
  expect,
  setupDb
}