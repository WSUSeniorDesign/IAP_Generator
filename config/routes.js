
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

const users = require('../app/controllers/users');
const incidents = require('../app/controllers/incidents'); // require the incidents controller
const ics204 = require('../app/controllers/ics204');

/**
 * Expose
 */

module.exports = function (app, passport, roles) {

  // app.get('/', home.index);
  app.get('/', function (req, res) {
    res.redirect('/incidents');
  })

  
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
  app.param('userId', users.load);

  /**
   * Incident routes
   */
  app.param('incidentId',                 incidents.load);

  app.get('/incidents',                   incidents.index); // a list of all incidents
  app.get('/incidents/new',               roles.can("create an incident"), incidents.new); // a form to add a new incident
  app.get('/incidents/:incidentId',       incidents.show); 
  app.get('/incidents/:incidentId/edit',  incidents.edit);
  app.post('/incidents',                  incidents.create);
  app.put('/incidents/:incidentId',       incidents.update);
  app.delete('/incidents/:incidentId',    incidents.destroy);

  /**
   * ICS 204
   */

  // There should probably be one controller for all forms, with params 
  // :incidentId, :operationalPeriodId, :formNumber, and :formId.
  // Ex: /incidents/:incidentId/:operationalPeriodId/:formNumber/:formId

  app.param('ics204formId',                                        ics204.load);

  app.get('/incidents/:incidentId/form/ics204/new',                ics204.new); // a form to create a new ICS204 document
  app.get('/incidents/:incidentId/form/ics204/:ics204formId',      ics204.show);
  app.delete('/incidents/:incidentId/form/ics204/:ics204formId',   ics204.destroy);
  app.get('/incidents/:incidentId/form/ics204/:ics204formId/edit', ics204.edit);
  app.put('/incidents/:incidentId/form/ics204/:ics204formId',      ics204.update);
  app.post('/incidents/:incidentId/form/ics204',                   ics204.create);

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
