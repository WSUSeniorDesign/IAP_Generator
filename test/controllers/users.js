const mocha = require("mocha");
const helpers = require("../test-helpers");
const app = helpers.app;
const chai = helpers.chai;
const expect = helpers.expect;

const mongoose = require("mongoose");
const User = mongoose.model("User");

describe("Users controller", function(done) {

  helpers.setupDb(User);

/*
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  // app.post('/users', roles.can("access non user pages"), users.create);
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', users.show);
*/

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

  describe("POST /users", function(done) {

    it("should return a status 200", function(done) {
      chai.request(app)
        .post(`/users`)
        .type("form")
        .send("name=foo")
        .send("username=foo")
        .send("email=foo@foo.com")
        .send("phoneNumber=foo")
        .send("password=foo")
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.redirect;
          expect(res).to.have.status(200);
          done();
        });
    });

    it("should create a user", function(done) {
      User.count({}, function(err, countBefore) {
        chai.request(app)
          .post(`/users`)
          .type("form")
          .send("name=foo")
          .send("username=foo")
          .send("email=foo@foo.com")
          .send("phoneNumber=foo")
          .send("password=foo")
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
