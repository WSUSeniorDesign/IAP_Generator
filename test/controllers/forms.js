const mocha = require("mocha");
const helpers = require("../test-helpers");
const app = helpers.app;
const chai = helpers.chai;
const expect = helpers.expect;

const mongoose = require("mongoose");
const Incident = mongoose.model("Incident");
const Period = mongoose.model("Period");

// we want to test the Forms controller against all possible forms
const formModels = [mongoose.model("ICS204"), mongoose.model("ICS206")]

formModels.forEach(function(FormModel) {

  describe(`Forms controller with ${FormModel.modelName}`, function() {
    var incident = null;
    var period = null;

    helpers.setupDb(Incident);
    helpers.setupDb(Period);
    helpers.setupDb(FormModel);

    beforeEach(function (done) {
      incident = new Incident({name: "Foo"});
      period = new Period({incident: incident, commander: "Bar", start: {date: "1"}, end: {date: "2"}});
      incident.setCurrentPeriod(period);
      incident.save(function(err) {
        if (err) return done(err);
        period.save(done);
      });
    });

    describe("GET /incidents/:incidentId/form/:formNum/new", function(done) {
      it("should return a status 200", function(done) {
        chai.request(app)
          .get(`/incidents/${incident._id}/form/${FormModel.modelName.toLowerCase()}/new`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    describe("POST /incidents/:incidentId/form/:formNum", function(done) {
      it("should create a form", function(done) {
        chai.request(app)
          .post(`/incidents/${incident._id}/form/${FormModel.modelName.toLowerCase()}`)
          .type("form")
          .send(`period=${period._id}`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    describe("GET /incidents/:incidentId/form/:formNum/:formId", function(done) {
      var form = null;

      beforeEach(function(done) {
        form = new FormModel({incident: incident._id, period: period._id});
        form.save(done);
      });

      it("should return a status 200", function(done) {
        chai.request(app)
          .get(`/incidents/${incident._id}/form/${FormModel.modelName.toLowerCase()}/${form._id}`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    describe("GET /incidents/:incidentId/form/:formNum/:formId/edit", function(done) {
      var form = null;

      beforeEach(function(done) {
        form = new FormModel({incident: incident._id, period: period._id});
        form.save(done);
      });

      it("should return a status 200", function(done) {
        chai.request(app)
          .get(`/incidents/${incident._id}/form/${FormModel.modelName.toLowerCase()}/${form._id}/edit`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    describe("PUT /incidents/:incidentId/form/:formNum/:formId", function(done) {
      var form = null;

      beforeEach(function(done) {
        form = new FormModel({incident: incident._id, period: period._id});
        form.save(done);
      });

      it("should update a form", function(done) {
        chai.request(app)
          .put(`/incidents/${incident._id}/form/${FormModel.modelName.toLowerCase()}/${form._id}`)
          .type("form")
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    describe("DELETE /incidents/:incidentId/form/:formNum/:formId", function(done) {
      var form = null;

      beforeEach(function(done) {
        form = new FormModel({incident: incident._id, period: period._id});
        form.save(done);
      });

      it("should delete a form", function(done) {
        chai.request(app)
          .del(`/incidents/${incident._id}/form/${FormModel.modelName}/${form._id}`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.redirect;

            FormModel.findOne({_id: form._id}, function(err, deletedForm) {
              if (err) return done(err);

              expect(deletedForm).to.be.null;

              done();
            });
          });
      });
    });

  // end main describe
  });
});
