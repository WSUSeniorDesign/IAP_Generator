const winston = require('winston');
const co = require('co-express');
const only = require('only');
const mongoose = require('mongoose');
const Ics204 = mongoose.model("ICS204");

exports.show = co(function* (req, res, next){
  req.form = yield Ics204.load(req.params.formId);
  if (!req.form) return next(new Error('ICS 204 form not found'));

  res.render('forms/ics204/show', {
    incident: req.incident, // loaded via app.param('incidentId') in routes.js
    form: req.form
  });
});

exports.new = function (req, res) {
  res.render('forms/ics204/new', {
    title: 'Assignment List (ICS 204)',
    incident: req.incident,
    form: new Ics204({})
  });
};

exports.create = co(function* (req, res) {
  const values = only(req.body, [
    'operationalPeriod',
    'field3',
    'operationsPersonnel',
    'resourcesAssigned',
    'workAssignments',
    'specialInstructions',
    'communications',
    'preparedBy'
  ]);
  values.incidentId = req.incident._id;

  // console.log(values);

  const ics204 = new Ics204(values);

  // const ics204 = new Ics204({
  //   incidentId: req.incident._id,
  //   operationalPeriod: {
  //     start: Date.parse(req.body.operationalPeriodStart),
  //     end: Date.parse(req.body.operationalPeriodEnd)
  //   },
  //   field3: {
  //     branch: req.body.field3Branch,
  //     division: req.body.field3Division,
  //     group: req.body.field3Group,
  //     stagingArea: req.body.field3stagingArea
  //   },
  //   operationsPersonnel: { 
  //     operationsSectionChiefName: req.body.operationsSectionChiefName, 
  //     operationsSectionChiefContactNumber: req.body.operationsSectionChiefContactNumber,
  //     branchDirectorName: req.body.branchDirectorName,
  //     branchDirectorContactNumber: req.body.branchDirectorContactNumber,
  //     divisionGroupSupervisorName: req.body.divisionGroupSupervisorName,
  //     divisionGroupSupervisorContactNumber: req.body.divisionGroupSupervisorContactNumber,
  //   },
  //   resourcesAssigned: [{
  //     resourceIdentifier: req.body.resourcesResourceIdentifier, 
  //     leader: req.body.resourcesLeader, 
  //     numOfPersons: req.body.resourcesNumOfPersons, 
  //     contact: req.body.resourcesContact
  //   }],
  //   workAssignments: req.body.workAssignments,
  //   specialInstructions: req.body.specialInstructions,
  //   communications: [{
  //     name: req.body.communicationsName,
  //     function: req.body.communicationsFunction,
  //     primaryContact: req.body.communicationsPrimaryContact
  //   }],
  //   preparedBy: {
  //     name: req.body.preparedByName,
  //     positionTitle: req.body.preparedByPositionTitle,
  //     signature: req.body.preparedBySignature,
  //     dateTime: Date.parse(req.body.preparedByDateTime)
  //   }
  // });

  yield ics204.save(function (err, ics204) {
    if (err) {
      // winston.error(err);
      // TODO: redirect the user to a useful error message
      console.log(err.errors);
    }
  });

  req.flash('success', 'Successfully created ICS 204!');
  res.redirect(`/incidents/${req.incident._id}/form/ics204/${ics204._id}`);
});
