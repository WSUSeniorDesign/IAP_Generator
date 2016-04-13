const co = require("co-express");
const only = require('only');

const mongoose = require('mongoose');
const Incident = mongoose.model('Incident');
const Period = mongoose.model("Period");

exports.load = co(function* (req, res, next, id) {
  req.period = yield Period.load(id);
  if (!req.period) return next(new Error('Operation Period not found'));
  next();
});

exports.new = function(req, res, next) {
  res.render('periods/new', {
    title: 'Create New Operational Period',
    incident: req.incident,
    period: new Period({})
  });
}

exports.create = function(req, res, next) {
  const period = new Period(req.body.period);
  period.incident = req.incident;

  period.save(function(err) {
    if (err) {
      if (err.name !== "ValidationError") {
        return next(new Error(err));
      }

      for (field in err.errors) {
        req.flash("error", err.errors[field].message);
      }
      return res.render('periods/new', {
        title: 'Create New Operational Period',
        incident: req.incident,
        period: period,
        errors: req.flash("error")
      });
    } 

    if (req.body.period.active) {
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

exports.edit = function(req, res, next) {
  res.render("periods/edit", {
    title: "Edit Operational Period",
    incident: req.incident,
    period: req.period
  });
}

exports.update = co(function* (req, res){
  const period = req.period;

  Object.assign(period, req.body.period);

  try {
    yield period.save();
  } catch (err) {
    if (err.name === "ValidationError") {
      for (field in err.errors) {
        req.flash("error", err.errors[field].message);
      }
      return res.render("periods/edit", {
        title: "Edit Operational Period",
        incident: req.incident,
        period: period,
        errors: req.flash("error")
      });
    } else {
      return next(new Error(err));
    }
  }

  if (period.id === req.incident.currentPeriod.id) {
    res.redirect(`/incidents/${req.incident.id}`);  
  } else {
    res.redirect(`/incidents/${req.incident.id}?period=${period.id}`);
  }
});

/*
// Need to consider before enabling this sort of feature:
// - if you delete an active period, what does the incident's current period become?
// - what happens with the forms associated with the period?
exports.destroy = function(req, res) {
  yield req.period.remove();
  req.flash('success', 'Deleted operational period successfully');
  res.redirect('/incidents');
}
*/
