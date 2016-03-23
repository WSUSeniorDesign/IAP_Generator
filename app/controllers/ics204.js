const winston = require('winston');
const co = require('co-express');
const only = require('only');
const mongoose = require('mongoose');
const Ics204 = mongoose.model("ICS204");

const ics204Fields = [
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
  res.render('forms/ics204/show.html', {
    incident: req.incident, // loaded via app.param('incidentId') in routes.js
    form: req.form
  });
};

exports.new = function (req, res) {
  res.render('forms/ics204/new.html', {
    title: 'Create New Assignment List (ICS 204)',
    incident: req.incident,
    form: new Ics204({period: req.incident.currentPeriod})
  });
};

exports.create = co(function* (req, res) {
  const form = new Ics204(only(req.body, ics204Fields));

  form.incident = req.incident;
  form.period = mongoose.Types.ObjectId(req.body.period);

  yield form.save(console.log);

  req.flash('success', 'Successfully created ICS 204!');
  res.redirect(`/incidents/${req.incident.id}/form/ics204/${form.id}`);
});

exports.edit = function (req, res) {
  res.render('forms/ics204/edit.html', {
    title: 'Edit Assignment List (ICS 204)',
    incident: req.incident,
    form: req.form
  });
};

exports.update = co(function* (req, res){
  const form = req.form;

  Object.assign(form, only(req.body, ics204Fields));

  yield form.save(console.log);

  res.redirect(`/incidents/${req.incident.id}/form/ics204/${form.id}`);
});

exports.destroy = co(function* (req, res) {
  yield req.form.remove();
  req.flash('success', `Deleted ICS204 #${req.form.id} successfully`);
  res.redirect(`/incidents/${req.incident.id}`);
});
