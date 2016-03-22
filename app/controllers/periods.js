const only = require('only');

const mongoose = require('mongoose');
const Incident = mongoose.model('Incident');
const Period = mongoose.model("Period");

// exports.load = co(function* (req, res, next, id) {
//   req.period = yield Period.load(id);
//   if (!req.period) return next(new Error('Operation Period not found'));
//   next();
// });

exports.new = function(req, res, next) {
  res.render('periods/new', {
    title: 'Create New Operational Period',
    incident: req.incident,
    period: new Period({})
  });
}

exports.create = function(req, res, next) {
  const period = new Period(only(req.body, "start end active"));
  period.incident = req.incident;

  period.save(function(err) {
    if (err) return next(new Error(err));

    if (req.body.active) {
      req.incident.setCurrentPeriod(period);
      req.incident.save(function(err) {
        if (err) return next(new Error(err));
        res.redirect(`/incidents/${req.incident.id}`);
      });
    } else {
      res.redirect(`/incidents/${req.incident.id}?period=${period.id}`);
    }
  });
}
