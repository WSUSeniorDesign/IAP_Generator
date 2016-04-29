
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

const users = require('../app/controllers/users');
const incidents = require('../app/controllers/incidents'); // require the incidents controller
const periods = require("../app/controllers/periods");
const forms = require("../app/controllers/forms");

/**
 * Expose
 */

module.exports = function (app, passport, roles) {

  app.get('/', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/incidents');
    } else {
      res.render('home', {title: "IAP Generator"});
    }
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
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', users.show);
  app.get('/users/:userId/edit', users.edit);
  app.put('/users/:userId', users.update);
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
  app.delete('/incidents/:incidentId',    roles.can("delete an incident"), incidents.destroy);

  /**
   * Operational Periods
   */
  app.get("/incidents/:incidentId/period/new",             roles.can("create an operational period"), periods.new); // commander + admin
  app.post("/incidents/:incidentId/periods",               roles.can("create an operational period"), periods.create); // commander + admin
  app.get("/incidents/:incidentId/period/:periodId/edit",  roles.can("edit an operational period"), periods.edit); // commander + admin
  app.put("/incidents/:incidentId/period/:periodId",       roles.can("update an operational period"), periods.update); // commander + admin
  // app.delete("/periods/:periodId",                         roles.can("delete an operational period"), periods.destroy);       

  /**
   * Forms
   */
  app.param("formNum", forms.setFormModel);
  app.param("formId",  forms.load);

  app.get('/incidents/:incidentId/form/:formNum/new',          roles.can("create a form"), forms.new); //commander, modifier, admin
  app.get('/incidents/:incidentId/form/:formNum/:formId',      roles.can("view a form"), forms.show); // all users (not anon)
  app.delete('/incidents/:incidentId/form/:formNum/:formId',   roles.can("delete a form"), forms.destroy); // commander + admin
  app.get('/incidents/:incidentId/form/:formNum/:formId/edit', roles.can("edit a form"), forms.edit);  //commander, modifier, admin
  app.put('/incidents/:incidentId/form/:formNum/:formId',      roles.can("edit a form"), forms.update);  //commander, modifier, admin
  app.post('/incidents/:incidentId/form/:formNum',             roles.can("create a form"), forms.create); //commander, modifier, admin

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
