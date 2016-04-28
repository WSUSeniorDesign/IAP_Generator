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
  // load the incident
  req.incident = yield Incident.load(id);
  if (!req.incident) return next(new Error('Incident not found'));

  // if there's a period param, load the period
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
  // load the list of Incidents
  const incidents = yield Incident.list({});

  res.render('incidents/index', {
    title: 'Incidents',
    incidents: incidents
  });
});


/**
 * VIEW AN INCIDENT
 * show() renders the ./app/views/incidents/show.jade view,
 * showing a single Incident. The Incident is pre-loaded into the 
 * req object as req.incident by the load() function defined above.
 */
exports.show = co(function* (req, res){
  var forms = [];

  // load Ics204 and Ics206 forms and append them onto forms
  Array.prototype.push.apply(forms, yield Ics204.loadByPeriodId(req.period._id));
  Array.prototype.push.apply(forms, yield Ics206.loadByPeriodId(req.period._id));

  res.render('incidents/show', {
    incident: req.incident,
    period: req.period,
    forms: forms
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
    incident: new Incident({}),
    period: new Period({})
  });
};

/**
 * CREATE A NEW INCIDENT
 * create() adds a new Incident to the database in response to a user
 * submitting the form given by the new() function above.
 */
exports.create = co(function* (req, res, next) {
  const incident = new Incident(req.body.incident);
  const period = new Period(req.body.period);

  // link incident and period together
  incident.active = true;
  incident.setCurrentPeriod(period);
  period.incident = incident;
  period.open();

  // validate both to expose errors
  // NOTE: we must validateSync() before saving instead of just doing try/catch like in other
  // controllers because we want to display error messages for both incident and period simultaneously
  const incidentErr = incident.validateSync();
  const periodErr = period.validateSync();

  // deal with errors
  if (incidentErr || periodErr) {
    if (incidentErr && incidentErr.name === "ValidationError") {
      for (field in incidentErr.errors) {
        req.flash("error", incidentErr.errors[field].message);
      }
    } else {
      return next(new Error(err));
    }
    if (periodErr && periodErr.name === "ValidationError") {
      for (field in periodErr.errors) {
        req.flash("error", periodErr.errors[field].message);
      }
    } else {
      return next(new Error(err));
    }

    // send the user back to the New page to fix the errors
    return res.render('incidents/new', {
      title: 'Create New Incident',
      incident: incident,
      period: period,
      errors: req.flash("error")
    });
  }

  // save things
  yield incident.save();
  yield period.save();

  // all went well
  req.flash('success', 'Successfully created incident!');
  res.redirect('/incidents/' + incident.id);
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

  Object.assign(incident, only(req.body.incident, 'name location active'));

  try {
    yield incident.save();
  } catch (err) {
    if (err.name === "ValidationError") {
      for (field in err.errors) {
        req.flash("error", err.errors[field].message);
      }
      return res.render('incidents/edit', {
        title: 'Edit Incident: ' + req.incident.title,
        incident: incident,
        errors: req.flash("error")
      });
    } else {
      return next(new Error(err));
    }
  }

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
