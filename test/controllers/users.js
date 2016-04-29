const mocha = require("mocha");
const helpers = require("../test-helpers");
const app = helpers.app;
const chai = helpers.chai;
const expect = helpers.expect;

const mongoose = require("mongoose");
const User = mongoose.model("User");

describe("Users controller", function(done) {

  helpers.setupDb(User);

  describe("GET /login", function(done) {
    it("should return a status 200", function(done) {
      chai.request(app)
        .get(`/login`)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GET /signup", function(done) {
    it("should return a status 200", function(done) {
      chai.request(app)
        .get(`/signup`)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GET /logout", function(done) {
    it("should return a status 200", function(done) {
      chai.request(app)
        .get(`/logout`)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("GET /users/:userId", function(done) {
    it("should return a status 200 for an existing user", function(done) {
      User.create({name:"foo",email:"foo@foo.com",password:"foo",phoneNumber:"foo",username:"foo"}, function(err, doc) {
        if (err) return done(err);
        chai.request(app)
          .get(`/users/${doc._id}`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    it("should return a status 404 for a non-existing user", function(done) {
      chai.request(app)
        .get(`/users/notauser`)
        .end(function (err, res) {
          expect(err).not.to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe("GET /users/:userId/edit", function(done) {
    it("should return a status 200 for an existing user", function(done) {
      User.create({name:"foo",email:"foo@foo.com",password:"foo",phoneNumber:"foo",username:"foo"}, function(err, doc) {
        if (err) return done(err);
        chai.request(app)
          .get(`/users/${doc._id}/edit`)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
    });

    it("should return a status 404 for a non-existing user", function(done) {
      chai.request(app)
        .get(`/users/notauser/edit`)
        .end(function (err, res) {
          expect(err).not.to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe("POST /users", function(done) {

    it("should create a user and return status 200", function(done) {
      User.count({}, function(err, countBefore) {
        chai.request(app)
          .post(`/users`)
          .type("form")
          .send("user[name]=foo")
          .send("user[username]=foo")
          .send("user[email]=foo@foo.com")
          .send("user[phoneNumber]=foo")
          .send("user[password]=foo")
          .end(function (err, res) {
            User.count({}, function(err, countAfter) {
              expect(err).to.be.null;
              expect(res).to.redirect;
              expect(res).to.have.status(200);
              expect(countAfter).to.equal(countBefore + 1);
              done();
            })
          });        
      });
    });
  });


  describe("PUT /users/:userId", function(done) {
    
    beforeEach(function(done) {
      User.create({name:"foo",email:"foo@foo.com",password:"foo",phoneNumber:"foo",username:"foo"}, done);
    });

    it("should update a user and return a status 200", function(done) {
      User.findOne({name:"foo"}, function(err, userBefore) {
        if (err) return done(err);
        chai.request(app)
          .put(`/users/${userBefore._id}`)
          .type("form")
          .send("user[name]=bar")
          .send("user[username]=bar")
          .send("user[email]=bar@bar.com")
          .send("user[phoneNumber]=bar")
          .send("user[password]=bar")
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.redirect;
            expect(res).to.have.status(200);

            User.findOne({_id: userBefore._id}, function (err, userAfter) {
              if (err) return done(err);

              expect(userAfter.name).to.equal("bar");
              expect(userAfter.username).to.equal("bar");
              expect(userAfter.email).to.equal("bar@bar.com");
              expect(userAfter.phoneNumber).to.equal("bar");

              done();
            });
          });          
      });
    });

  });

  describe("POST /users/session", function(done) {

    beforeEach(function(done) {
      User.create({name:"foo",email:"foo@foo.com",password:"foo",phoneNumber:"foo",username:"foo"}, done);
    });

    describe("with correct credentials", function() {
      it("should log in and return a status 200", function(done) {
        chai.request(app)
          .post(`/users/session`)
          .type("form")
          .send("email=foo@foo.com")
          .send("password=foo")
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.have.cookie('express:sess');
            done();
          });
      });
    })

    describe("with incorrect credentials", function() {
      it("should not log in gracefully handle errors", function(done) {
        chai.request(app)
          .post(`/users/session`)
          .type("form")
          .send("email=foo@foo.com")
          .send("password=WRONG")
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.redirect;
            done();
          });
      });
    });

  });

});
