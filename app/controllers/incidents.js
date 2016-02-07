// This controller is based on the structure used in
// https://github.com/madhums/node-express-mongoose-demo

const mongoose = require('mongoose');
const wrap = require('co-express');
const Incident = mongoose.model('Incident');

// This function loads an Incident by ID.
exports.load = wrap(function* (req, res, next, id) {
  req.incident = yield Incident.load(id);
  if (!req.incident) return next(new Error('Incident not found'));
  next();
});

// This function renders the incidents/index view, showing a paged list of Incidents.
exports.index = wrap(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const limit = 30;
  const options = {
    limit: limit,
    page: page
  };

  const incidents = yield Incident.list(options);
  const count = yield Incident.count();

  res.render('incidents/index', {
    title: 'Incidents',
    incidents: incidents,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});

// This function renders the incidents/show view, showing a single Incident.
exports.show = function (req, res){
  res.render('incidents/show', {
    incident: req.incident
  });
};
