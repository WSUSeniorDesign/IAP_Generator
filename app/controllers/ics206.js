const winston = require('winston');
const co = require('co-express');
const only = require('only');
const mongoose = require('mongoose');
const Ics206 = mongoose.model("ICS206");

const ics204Fields = [
  'medicalAidStations',
  'transportation',
  'hospitals',
  'specMedEmerProc',
  'preparedBy',
  'approvedBy'
];

exports.load = co(function* (req, res, next){
  req.form = yield Ics206.load(req.params.ics206formId);
  if (!req.form) return next(new Error('ICS 206 form not found'));
  next();
});

exports.show = function (req, res) {
  res.render('forms/ics206/show.html', {
    incident: req.incident, // loaded via app.param('incidentId') in routes.js
    form: req.form
  });
};

exports.new = function (req, res) {
  res.render('forms/ics206/new.html', {
    title: 'Create New Assignment List (ICS 206)',
    incident: req.incident,
    form: new Ics206({period: req.incident.currentPeriod})
  });
};

exports.create = co(function* (req, res) {
  const form = new Ics206(only(req.body, ics206Fields));

  form.incident = req.incident;
  form.period = mongoose.Types.ObjectId(req.body.period);

  yield form.save(console.log);

  req.flash('success', 'Successfully created ICS 206!');
  res.redirect(`/incidents/${req.incident.id}/form/ics206/${form.id}`);
});

exports.edit = function (req, res) {
  res.render('forms/ics206/edit.html', {
    title: 'Edit Assignment List (ICS 206)',
    incident: req.incident,
    form: req.form
  });
};

exports.update = co(function* (req, res){
  const form = req.form;

  Object.assign(form, only(req.body, ics206Fields));

  yield form.save(console.log);

  res.redirect(`/incidents/${req.incident.id}/form/ics206/${form.id}`);
});

exports.destroy = co(function* (req, res) {
  yield req.form.remove();
  req.flash('success', `Deleted ICS206 #${req.form.id} successfully`);
  res.redirect(`/incidents/${req.incident.id}`);
});
