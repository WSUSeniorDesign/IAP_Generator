const mocha = require("mocha");
const expect = require("chai").expect;

const ConnectRoles = require("connect-roles");
const roles = require("../config/roles")(ConnectRoles, {});

// a list of our actions and their expected role
const actionsToTest = [
  { name: 'view all incidents',           role: 'commander' },
  { name: 'create an incident',           role: 'commander' },
  { name: 'edit an incident',             role: 'commander' },
  { name: 'create an operational period', role: 'commander' },
  { name: 'edit an operational period',   role: 'commander' },
  { name: 'update an operational period', role: 'commander' },
  { name: 'delete an incident',           role: 'commander' },
  { name: 'delete an operational period', role: 'commander' },
  { name: 'view an incident',             role: 'basic' },
  { name: 'view a form',                  role: 'basic' },
  { name: 'create a form',                role: 'commander' },
  { name: 'edit a form',                  role: 'commander' },
  { name: 'delete a form',                role: 'commander' }
];

// maps each expected role to roles which are valid
const rolesToTest = {
  basic: {
    accepts: ['basic', 'modifier', 'commander', 'admin'],
    rejects: []
  },
  modifier: {
    accepts: ['modifier', 'commander', 'admin'],
    rejects: ['basic']
  },
  commander: {
    accepts: ['commander', 'admin'],
    rejects: ['basic', 'modifier']
  },
  admin: {
    accepts: ['admin'],
    rejects: ['basic', 'modifier', 'commander']
  }
};

// run tests
describe("Access Control", function () {
  // dummy request to send to roles.test()
  var request = {
    isAuthenticated: function() { return true; }
  };

  before(function(done) {
    // pretend we're in dev mode so roles are actually processed
    process.env.NODE_ENV = "development";
    done();
  });

  after(function(done) {
    // return to test mode
    process.env.NODE_ENV = "test";
    done();
  });

  actionsToTest.forEach(function (action) {
    describe(`for action '${action.name}'`, function () {
      rolesToTest[action.role].accepts.forEach(function (passingRole) {
        it(`accepts role '${passingRole}'`, function(done) {
          expect(roles.test(Object.assign(request, {user: {role: passingRole}}), action.name)).to.be.true;
          done();
        })
      });

      rolesToTest[action.role].rejects.forEach(function (failingRole) {
        it(`rejects role '${failingRole}'`, function(done) {
          expect(roles.test(Object.assign(request, {user: {role: failingRole}}), action.name)).to.be.false;
          done();
        })
      });
    });
  });
});
