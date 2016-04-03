// This controller is based on the structure used in
// https://github.com/madhums/node-express-mongoose-demo/blob/master/app/controllers/articles.js

// The function*() { yield ...; } pattern is called a Generator function,
// which is part of ES6 and is available for use in Node.js applications.
// The co-express module allows you to use generators as Express middleware.
// See: https://github.com/mciparelli/co-express
// See: https://davidwalsh.name/es6-generators
const co = require('co-express');

// only() is used to isolate object properties, returning only properties requested.
// See: https://github.com/tj/node-only
const only = require('only');

const mongoose = require('mongoose');
const Incident = mongoose.model('Incident');
const Ics204 = mongoose.model('ICS204');
const Ics206 = mongoose.model('ICS206');
const Period = mongoose.model("Period");

/**
 * This is a helper function, which attempts to load an Incident
 * from the database by id. In ./app/config/routes.js it is passed as
 * 
 *   app.param('incidentId', incidents.load);
 *
 * so that if a route contains the parameter :incidentId, such as in 
 *
 *   app.get('/incidents/:incidentId', incidents.show)
 *
 * the Incident will be loaded and added to the req object, and can be
 * accessed via req.incident (see the code in the show() function below).
 */
exports.load = co(function* (req, res, next, id) {
  req.incident = yield Incident.load(id);
  if (!req.incident) return next(new Error('Incident not found'));

  if (req.query.period && mongoose.Types.ObjectId.isValid(req.query.period)) {
    req.period = yield Period.load(req.query.period);
    if (!req.period) return next(new Error("Period not found"));
    if (req.period.incident.toString() !== req.incident.id) return next(new Error("Period did not belong to the current Incident"));
  } else {
    req.period = req.incident.currentPeriod;
  }

  next();
});


/**
 * LIST OF INCIDENTS
 * index() renders the ./app/views/incidents/index.jade view,
 * showing a paged list of Incidents.
 */
exports.index = co(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const limit = 30;
  const options = {
    limit: limit,
    page: page
  };

  // load the list of Incidents
  const incidents = yield Incident.list(options);

  // get a count of the total number of Incidents
  const count = yield Incident.count({});

  res.render('incidents/index', {
    title: 'Incidents',
    incidents: incidents,
    count: count,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});


/**
 * VIEW AN INCIDENT
 * show() renders the ./app/views/incidents/show.jade view,
 * showing a single Incident. The Incident is pre-loaded into the 
 * req object as req.incident by the load() function defined above.
 */
exports.show = co(function* (req, res){
  req.incident.forms = {
    ics204: yield Ics204.loadByPeriodId(req.period._id),
	ics206: yield Ics206.loadByPeriodId(req.period._id)
  };
  

  res.render('incidents/show', {
    incident: req.incident,
    period: req.period
  });
});

/**
 * FORM TO CREATE A NEW INCIDENT
 * new() renders the ./app/views/incidents/new.jade view, giving the user a
 * form to enter data for a new Incident.
 */
exports.new = function (req, res){
  res.render('incidents/new', {
    title: 'Create New Incident',
    incident: new Incident({})
  });
};

/**
 * CREATE A NEW INCIDENT
 * create() adds a new Incident to the database in response to a user
 * submitting the form given by the new() function above.
 */
exports.create = co(function* (req, res) {
  const incident = new Incident(req.body.incident);
  const period = new Period(req.body.period);

  incident.active = true;
  incident.setCurrentPeriod(period);
  yield incident.save();

  period.incident = incident;
  period.open();
  yield period.save();

  req.flash('success', 'Successfully created incident!');
  res.redirect('/incidents/' + incident._id);
});

/**
 * FORM TO EDIT AN INCIDENT
 * edit() renders the ./app/views/incidents/edit.jade view, giving the user
 * a form to edit an Incident, pre-populated with the Incident's current values.
 */
exports.edit = function (req, res) {
  res.render('incidents/edit', {
    title: 'Edit Incident: ' + req.incident.title,
    incident: req.incident
  });
};

/**
 * UPDATE INCIDENT
 * update() updates and saves an Incident in the database
 */
exports.update = co(function* (req, res){
  const incident = req.incident;

  // Object.assign() merges objects from right to left. Here, the
  // incident object will be assigned the values:
  //
  //   incident.name = req.body.name
  //   incident.location = req.body.location
  //   incident.active = req.body.active
  //
  // retaining all its other values.
  Object.assign(incident, only(req.body.incident, 'name location active'));

  yield incident.save();

  res.redirect('/incidents/' + incident._id);
});

/**
 * DELETE AN INCIDENT
 * delete() removes an Incident from the database.
 */
exports.destroy = co(function* (req, res) {
  yield req.incident.remove();
  req.flash('success', 'Deleted successfully');
  res.redirect('/incidents');
});
