const mocha = require("mocha");
const helpers = require("../test-helpers");
const app = helpers.app;
const chai = helpers.chai;
const expect = helpers.expect;

const mongoose = require("mongoose");
const Incident = mongoose.model("Incident");
const Period = mongoose.model("Period");
const ICS204 = mongoose.model("ICS204");

describe("Periods controller", function(done) {

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

  describe("GET /incidents/:incidentId?period=:periodId", function(done) {
    beforeEach(function(done){
      // create a new period so that there is a current and previous period available
      Incident.findOne({name: "Foo"}).populate("currentPeriod").exec(function(err, incident) {
        if (err) return done(err);

        const newPeriod = new Period({incident: incident, commander: "Nemo", start: {date: "3"}, end: {date: "4"}});
        newPeriod.save(function(err) {
          if (err) return done(err);

          incident.setCurrentPeriod(newPeriod);
          incident.save(done);
        })
      });
    });

    it("should return a status 200 for a previous period", function(done) {
      Incident.findOne({name: "Foo"}).populate("currentPeriod").exec(function(err, doc) {
        if (err) return done(err);
        chai.request(app)
          .get(`/incidents/${doc._id}?period=${doc.currentPeriod.prevPeriod.toString()}`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    it("should return a status 404 for an invalid periodId", function(done) {
      Incident.findOne({name: "Foo"}, function(err, doc) {
        if (err) return done(err);
        chai.request(app)
          .get(`/incidents/${doc._id}?period=0`)
          .end(function (err, res) {
            expect(err).to.not.be.null;
            expect(res).to.have.status(404);
            done();
          });
      });
    });
  });

  describe("GET /incidents/:incidentId/period/new", function(done) {
    it("should return a status 200", function(done) {
      Incident.findOne({name: "Foo"}).exec(function(err, doc) {
        if (err) return done(err);
        chai.request(app)
          .get(`/incidents/${doc._id}/period/new`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });
  });

  describe("GET /incidents/:incidentId/period/:periodId/edit", function(done) {
    it("should return a status 200", function(done) {
      Incident.findOne({name: "Foo"}).populate("currentPeriod").exec(function(err, doc) {
        if (err) return done(err);
        chai.request(app)
          .get(`/incidents/${doc._id}/period/${doc.currentPeriod._id}/edit`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });
  });

  describe("POST /incidents/:incidentId/periods", function(done) {

    it("should return a status 200", function(done) {
      Incident.findOne({name: "Foo"}).populate("currentPeriod").exec(function(err, doc) {
        if (err) return done(err);
        chai.request(app)
          .post(`/incidents/${doc._id}/periods`)
          .type("form")
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
    });

    it("should gracefully handle missing required fields", function(done) {
      Incident.findOne({name: "Foo"}).populate("currentPeriod").exec(function(err, doc) {
        if (err) return done(err);
        chai.request(app)
          .post(`/incidents/${doc._id}/periods`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    it("should create a new period", function(done) {
      Incident.findOne({name: "Foo"}).populate("currentPeriod").exec(function(err, incident) {
        if (err) return done(err);
        Period.count({incident: incident._id}, function(err, countBefore) {
          if (err) return done(err);

          chai.request(app)
            .post(`/incidents/${incident._id}/periods`)
            .type("form")
            .send("period[commander]=bar")
            .send("period[start][date]=1900")
            .send("period[end][date]=1901")
            .end(function (err, res) {
              if (err) return done(err);

              Period.count({incident: incident._id}, function(err, countAfter) {
                if (err) return done(err);

                expect(countAfter).to.equal(countBefore + 1);
                done();
              });
            });
        });
      });
    });    
  });

  describe("PUT /incidents/:incidentId/period/:periodId", function(done) {
    it("should update a period", function(done) {
      Incident.findOne({name: "Foo"}).populate("currentPeriod").exec(function(err, incident) {
        if (err) return done(err);

        chai.request(app)
          .put(`/incidents/${incident._id}/period/${incident.currentPeriod._id}`)
          .type("form")
          .send("period[commander]=SomethingNew")
          .end(function (err, res) {
            expect(err).to.be.null;

            Period.findOne({_id: incident.currentPeriod._id}, function(err, periodAfter) {
              if (err) return done(err);

              expect(periodAfter.commander).to.equal("SomethingNew");

              done();
            });
          });
      });
    });
  });

});
