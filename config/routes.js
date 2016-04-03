
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

const users = require('../app/controllers/users');
const incidents = require('../app/controllers/incidents'); // require the incidents controller
const periods = require("../app/controllers/periods");
const ics204 = require('../app/controllers/ics204');

/**
 * Expose
 */

module.exports = function (app, passport, roles) {

  // app.get('/', home.index);
  app.get('/', function (req, res) {
    res.redirect('/incidents');
  });

  app.param('incidentId', incidents.load);
  app.param('periodId', periods.load);

  
  /**
   * User routes
   */
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
  app.param('userId', users.load);

  /**
   * Incident routes
   */
  app.get('/incidents',                   roles.can("view all incidents"), incidents.index); // a list of all incidents
  app.get('/incidents/new',               roles.can("create an incident"), incidents.new); // a form to add a new incident
  app.get('/incidents/:incidentId',       roles.can("view an incident"), incidents.show); 
  app.get('/incidents/:incidentId/edit',  roles.can("edit an incident"), incidents.edit);
  app.post('/incidents',                  roles.can("create an incident"), incidents.create);
  app.put('/incidents/:incidentId',       roles.can("edit an incident"), incidents.update);
  app.delete('/incidents/:incidentId',    incidents.destroy);

  /**
   * Operational Periods
   */
  app.get("/incidents/:incidentId/period/new",             periods.new); // commander + admin
  app.post("/incidents/:incidentId/periods",               periods.create); // commander + admin
  app.get("/incidents/:incidentId/period/:periodId/edit",  periods.edit); // commander + admin
  app.put("/incidents/:incidentId/period/:periodId",       periods.update); // commander + admin
  // app.delete("/periods/:periodId",                         periods.destroy);       

  /**
   * ICS 204
   */

  // There should probably be one controller for all forms, with params 
  // :incidentId, :operationalPeriodId, :formNumber, and :formId.
  // Ex: /incidents/:incidentId/:operationalPeriodId/:formNumber/:formId

  app.param('ics204formId',                                        ics204.load); 

  app.get('/incidents/:incidentId/form/ics204/new',                ics204.new); //commander, modifier, admin // a form to create a new ICS204 document
  app.get('/incidents/:incidentId/form/ics204/:ics204formId',      ics204.show); // all users (not anon)
  app.delete('/incidents/:incidentId/form/ics204/:ics204formId',   ics204.destroy); //commander + admin
  app.get('/incidents/:incidentId/form/ics204/:ics204formId/edit', ics204.edit); //commander, modifier, admin
  app.put('/incidents/:incidentId/form/ics204/:ics204formId',      ics204.update); //commander, modifier, admin
  app.post('/incidents/:incidentId/form/ics204',                   ics204.create); //commander, modifier, admin

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
