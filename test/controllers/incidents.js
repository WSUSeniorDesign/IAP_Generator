const mocha = require("mocha");
const helpers = require("../test-helpers");
const app = helpers.app;
const chai = helpers.chai;
const expect = helpers.expect;

const mongoose = require("mongoose");
const Incident = mongoose.model("Incident");
const Period = mongoose.model("Period");

describe("Incidents controller", function(done) {

  // set up the test database for Incidents
  helpers.setupDb(Incident);
  helpers.setupDb(Period);

  // an Incident must be created along with a Period
  beforeEach(function (done) {
    var incident = new Incident({name: "Foo"});
    var period = new Period({incident: incident, commander: "Bar", start: {date: "1"}, end: {date: "2"}});
    incident.setCurrentPeriod(period);
    incident.save(function(err) {
      if (err) return done(err);
      period.save(done);
    })
  });

  describe("GET /incidents", function(done) {    
    it("should return a status 200", function(done) {
      chai.request(app)
        .get('/incidents')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GET /incidents/new", function(done) {
    it("should return a status 200", function(done) {
      chai.request(app)
        .get('/incidents/new')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GET /incidents/:incidentId", function(done) {

    it("should return a status 200", function(done) {
      Incident.findOne({name: "Foo"}, function(err, doc) {
        if (err) return done(err);
        chai.request(app)
          .get(`/incidents/${doc._id}`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    it("should return a status 404 for an invalid id", function(done) {
      chai.request(app)
        .get('/incidents/0')
        .end(function (err, res) {
            expect(err).to.not.be.null;
            expect(res).to.have.status(404);
            done();
          });
    });    
  });

  describe("GET /incidents/:incidentId/edit", function(done) {
    it("should return a status 200", function(done) {
      Incident.findOne({name: "Foo"}, function(err, doc) {
        if (err) return done(err);
        chai.request(app)
          .get(`/incidents/${doc._id}/edit`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });
  });

  describe("POST /incidents", function(done) {
    it("should return a status 200", function(done) {
      chai.request(app)
        .post('/incidents')
        .type("form")
        .send("incident[name]=foo")
        .send("period[commander]=bar")
        .send("period[start][date]=1900")
        .send("period[end][date]=1901")
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.redirect;
          expect(res).to.have.status(200);
          done();
        });
    });

    it("should gracefully handle missing required fields", function(done) {
      chai.request(app)
        .post('/incidents')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });

    it("should create an incident", function(done) {
      Incident.count({}, function(err, countBefore) {
        if (err) return done(err);

        chai.request(app)
          .post('/incidents')
          .type("form")
          .send("incident[name]=foo")
          .send("period[commander]=bar")
          .send("period[start][date]=1900")
          .send("period[end][date]=1901")
          .end(function (err, res) {
            if (err) return done(err);

            Incident.count(function(err, countAfter) {
              if (err) return done(err);

              expect(countAfter).to.equal(countBefore + 1);
              done();
            });
          });
      })
    });    
  });

  describe("PUT /incidents/:incidentId", function(done) {
    it("should update an incident", function(done) {
      Incident.findOne({name: "Foo"}, function(err, docBefore) {
        if (err) return done(err);

        chai.request(app)
          .put(`/incidents/${docBefore._id}`)
          .type("form")
          .send("incident[name]=Bar")
          .end(function (err, res) {
            expect(err).to.be.null;

            Incident.findOne({_id: docBefore._id}, function(err, docAfter) {
              if (err) return done(err);

              expect(docAfter._id).to.eql(docBefore._id);
              expect(docBefore.name).to.equal("Foo");
              expect(docAfter.name).to.equal("Bar");

              done();
            });
          });
      });
    });
  });

  describe("DELETE /incidents/:incidentId", function(done) {
    it("should delete an incident", function(done) {
      Incident.findOne({name: "Foo"}, function(err, docBefore) {
        if (err) return done(err);

        chai.request(app)
          .del(`/incidents/${docBefore._id}`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.redirect;

            Incident.findOne({_id: docBefore._id}, function(err, docAfter) {
              if (err) return done(err);

              expect(docAfter).to.be.null;

              done();
            });
          });
      });
    });
  });

});