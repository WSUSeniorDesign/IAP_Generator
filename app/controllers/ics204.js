const winston = require('winston');
const co = require('co-express');
const only = require('only');
const mongoose = require('mongoose');
const Ics204 = mongoose.model("ICS204");

const ics204Fields = [
  'operationalPeriod',
  'field3',
  'operationsPersonnel',
  'resourcesAssigned',
  'workAssignments',
  'specialInstructions',
  'communications',
  'preparedBy'
];

exports.load = co(function* (req, res, next){
  req.form = yield Ics204.load(req.params.ics204formId);
  if (!req.form) return next(new Error('ICS 204 form not found'));
  next();
});

exports.show = function (req, res) {
  res.render('forms/ics204/form.html', {
    incident: req.incident, // loaded via app.param('incidentId') in routes.js
    form: req.form
  });
};

exports.new = function (req, res) {
  res.render('forms/ics204/form.html', {
    title: 'Create New Assignment List (ICS 204)',
    incident: req.incident,
    form: new Ics204({})
  });
};

exports.create = co(function* (req, res) {
  const values = only(req.body, ics204Fields);
  values.incidentId = req.incident._id;

  const ics204 = new Ics204(values);

  yield ics204.save(function (err, ics204) {
    if (err) {
      // TODO: redirect the user to a useful error message
	  console.log(err);
    }
  });

  req.flash('success', 'Successfully created ICS 204!');
  res.redirect(`/incidents/${req.incident._id}/form/ics204/${ics204._id}`);
});

exports.edit = function (req, res) {
  res.render('forms/ics204/form.html', {
    title: 'Edit Assignment List (ICS 204)',
    incident: req.incident,
    form: req.form
  });
};

exports.update = co(function* (req, res){
  const form = req.form;

  Object.assign(form, only(req.body, ics204Fields));

  yield form.save();

  res.redirect(`/incidents/${req.incident.id}/form/ics204/${form.id}`);
});

exports.destroy = co(function* (req, res) {
  yield req.form.remove();
  req.flash('success', `Deleted ICS204 #${req.form.id} successfully`);
  res.redirect(`/incidents/${req.incident.id}`);
});
