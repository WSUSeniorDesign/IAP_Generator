// express
const app = require("../server").app;

// chai
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const chaiHttp = require("chai-http");
// const sinon = require("sinon");
// const sinonChai = require("sinon-chai");
chai.use(chaiAsPromised);
// chai.use(sinonChai);
chai.use(chaiHttp); 


// clean up the database and create dummy values for a specific model
function setupDb(model, dummies) {
  // clean database initially
  // console.log("setupDb: dropping " + model.name);
  model.collection.drop();


  // set up database
  beforeEach(function(done) {
    // console.log("beforeEach: inside setupDb");
    if (dummies) {
      model.create(dummies, done);
    } else {
      done();
    }
  });

  // clean database each time
  afterEach(function (done) {
    // console.log("afterEach: dropping");
    model.collection.drop();
    done();
  });
}

module.exports = {
  app,
  chai,
  // sinon,
  expect,
  // spyRender,
  setupDb
}