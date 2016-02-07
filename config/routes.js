
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var home = require('home');
const incidents = require('incidents'); // require the incidents controller

/**
 * Expose
 */

module.exports = function (app, passport) {

  // app.get('/', home.index);
  app.get('/', function (req, res) {
    res.redirect('/incidents');
  })

  /**
   * Incident routes
   */
  app.param('incidentId',                 incidents.load);
  app.get('/incidents',                   incidents.index);
  app.get('/incidents/new',               incidents.new);
  app.get('/incidents/:incidentId',       incidents.show);
  app.get('/incidents/:incidentId/edit',  incidents.edit);
  app.post('/incidents',                  incidents.create);
  app.put('/incidents/:incidentId',       incidents.update);
  app.delete('/incidents/:incidentId',    incidents.destroy);

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
