const mocha = require("mocha");
const helpers = require("../test-helpers");
const app = helpers.app;
const chai = helpers.chai;
const request = chai.request;
const expect = helpers.expect;

const mongoose = require("mongoose");
const Incident = mongoose.model("Incident");
const Period = mongoose.model("Period");

function createDummies(done) {
  var incident = new Incident({name: "Foo"});
  var period = new Period({incident: incident, commander: "Bar", start: {date: "1"}, end: {date: "2"}});
  incident.setCurrentPeriod(period);
  incident.save(function(err) {
    if (err) return done(err);
    incidentId = incident.id;
    period.save(done);
  })
}

describe("Incident controller", function() {

  // set up the test database for Incidents
  helpers.setupDb(Incident);
  helpers.setupDb(Period);

  describe("GET /incidents", function(done) {    
    it("should exist", function() {
      return request(app)
        .get('/incidents')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GET /incidents/new", function(done) {
    it("should exist", function() {
      return request(app)
        .get('/incidents/new')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GET /incidents/:incidentId", function(done) {
    before(createDummies);

    it("should exist", function(done) {
      Incident.findOne({name: "Foo"}, function(err, doc) {
        if (err) return done(err);
        console.log(doc);
        request(app)
          .get('/incidents/' + doc._id)
          .end(function (err, res) {
            // expect(err).to.be.null;
            console.log("hi!");
            expect(res).to.have.status(200);
            done();
          });
      });
    });
  });

  describe("GET /incidents/:incidentId/edit", function(done) {});
  describe("POST /incidents", function(done) {});
  describe("PUT /incidents/:incidentId", function(done) {});
  describe("DELETE /incidents/:incidentId", function(done) {});

});