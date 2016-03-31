
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var home = require('../app/controllers/home');

const incidents = require('../app/controllers/incidents'); // require the incidents controller
const periods = require("../app/controllers/periods");
const ics204 = require('../app/controllers/ics204');
const ics206 = require('../app/controllers/ics206');

/**
 * Expose
 */

module.exports = function (app, passport) {

  // app.get('/', home.index);
  app.get('/', function (req, res) {
    res.redirect('/incidents');
  });

  app.param('incidentId', incidents.load);
  app.param('periodId', periods.load);

  /**
   * Incident routes
   */
  app.get('/incidents',                   incidents.index); // a list of all incidents
  app.get('/incidents/new',               incidents.new); // a form to add a new incident
  app.get('/incidents/:incidentId',       incidents.show); 
  app.get('/incidents/:incidentId/edit',  incidents.edit);
  app.post('/incidents',                  incidents.create);
  app.put('/incidents/:incidentId',       incidents.update);
  app.delete('/incidents/:incidentId',    incidents.destroy);

  /**
   * Operational Periods
   */
  app.get("/incidents/:incidentId/period/new",             periods.new);
  app.post("/incidents/:incidentId/periods",               periods.create);
  app.get("/incidents/:incidentId/period/:periodId/edit",  periods.edit);
  app.put("/incidents/:incidentId/period/:periodId",       periods.update);
  // app.delete("/periods/:periodId",                         periods.destroy);       

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
   * ICS 206
   */

  app.param('ics206formId',                                        ics206.load);

  app.get('/incidents/:incidentId/form/ics206/new',                ics206.new); // a form to create a new ICS204 document
  app.get('/incidents/:incidentId/form/ics206/:ics206formId',      ics206.show);
  app.delete('/incidents/:incidentId/form/ics206/:ics206formId',   ics206.destroy);
  app.get('/incidents/:incidentId/form/ics206/:ics206formId/edit', ics206.edit);
  app.put('/incidents/:incidentId/form/ics206/:ics206formId',      ics206.update);
  app.post('/incidents/:incidentId/form/ics206',                   ics206.create);

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
