
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

const incidents = require('../app/controllers/incidents');
const periods = require("../app/controllers/periods");
const forms = require("../app/controllers/forms");

/**
 * Expose
 */

module.exports = function (app, passport) {

  app.get('/', function (req, res) {
    res.redirect('/incidents');
  });

  /**
   * Incidents
   */

  app.param("incidentId", incidents.load);

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

  app.param("periodId", periods.load);

  app.get("/incidents/:incidentId/period/new",             periods.new);
  app.post("/incidents/:incidentId/periods",               periods.create);
  app.get("/incidents/:incidentId/period/:periodId/edit",  periods.edit);
  app.put("/incidents/:incidentId/period/:periodId",       periods.update);

  /**
   * Forms
   */

  app.param("formNum", forms.setFormModel);
  app.param("formId",  forms.load);

  app.get('/incidents/:incidentId/form/:formNum/new',          forms.new);
  app.get('/incidents/:incidentId/form/:formNum/:formId',      forms.show);
  app.delete('/incidents/:incidentId/form/:formNum/:formId',   forms.destroy);
  app.get('/incidents/:incidentId/form/:formNum/:formId/edit', forms.edit);
  app.put('/incidents/:incidentId/form/:formNum/:formId',      forms.update);
  app.post('/incidents/:incidentId/form/:formNum',             forms.create);

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
