const winston = require('winston');
const co = require('co-express');
const only = require('only');
const mongoose = require('mongoose');

const formModels = {
  ics204: mongoose.model("ICS204"),
  ics206: mongoose.model("ICS206")
};

/**
 * Based on :formNum route parameter, sets req.formModel with the corresponding Mongoose model.
 */
exports.setFormModel = function(req, res, next, formNum) {
  formNum = formNum.toLowerCase();
  if (formModels.hasOwnProperty(formNum)) {
    req.formModel = formModels[formNum];
    next();
  } else {
    req.flash("error", "Form not supported.");
    res.redirect(`/incidents/${req.incident.id}`);
  }
};

/**
 * Loads a form based on the :formId route parameter.
 */
exports.load = co(function* (req, res, next) {
  req.form = yield req.formModel.load(req.params.formId);
  if (!req.form) return next(new Error('Form not found.'));
  next();
});

/**
 * Renders the show.html view to display a specific form.
 */
exports.show = function (req, res) {
  res.render(`forms/${req.formModel.modelName.toLowerCase()}/show.html`, {
    incident: req.incident,
    form: req.form
  });
};

/**
 * Renders the new.html view to allow creating a specific form.
 */
exports.new = function (req, res) {
  res.render(`forms/${req.formModel.modelName.toLowerCase()}/new.html`, {
    title: `Create New ${req.formModel.title()}`,
    incident: req.incident,
    form: new req.formModel({period: req.incident.currentPeriod})
  });
};

/**
 * Accepts a form submitted from new.html and creates a new document in the database.
 */
exports.create = co(function* (req, res) {
  const form = req.formModel.new(only(req.body, req.formModel.fieldMask()));

  form.incident = req.incident;
  form.period = mongoose.Types.ObjectId(req.body.period);

  yield form.save();

  req.flash('success', `Created ${req.formModel.modelName} successfully.`);
  res.redirect(`/incidents/${req.incident.id}/form/${form.modelName.toLowerCase()}/${form.id}`);
});

/**
 * Renders the edit.html view to allow editing a specific form.
 */
exports.edit = function (req, res) {
  res.render(`forms/${req.formModel.modelName.toLowerCase()}/edit.html`, {
    title: `Edit ${req.formModel.title()}`,
    incident: req.incident,
    form: req.form
  });
};

/**
 * Accepts a form submitted from edit.html and updates an existing document in the database.
 */
exports.update = co(function* (req, res){
  const form = req.form;

  Object.assign(form, only(req.body, req.formModel.fieldMask()));

  yield form.save();

  req.flash("success", `Updated ${req.formModel.modelName} successfully.`);
  res.redirect(`/incidents/${req.incident.id}/form/${req.formModel.modelName.toLowerCase()}/${form.id}`);
});

/**
 * Deletes a specific form document from the database.
 */
exports.destroy = co(function* (req, res) {
  yield req.form.remove();
  req.flash('success', `Deleted ${req.formModel.modelName} successfully.`);
  res.redirect(`/incidents/${req.incident.id}`);
});
