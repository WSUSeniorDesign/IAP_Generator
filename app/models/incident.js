const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validate = require("mongoose-validator");

const per = require("./period"); // ensure Period is registered before Incident
const Period = mongoose.model("Period");

// Mongoose schema guide: http://mongoosejs.com/docs/guide.html 

const IncidentSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: {type: String, required: [true, "Incident Name is required."] },
  location: String,
  currentPeriod: { type: Schema.Types.ObjectId, ref: "Period" },
  active: {
    type: Boolean,
    // default to false because checkboxes are only sent by the browser if they're checked,
    // so if they check the Active box on the form, it will overwrite this value, and if they don't,
    // it will take the default value of false.
    default: false
  },
  createdAt: { type: Date, default : Date.now }
});

IncidentSchema.methods = {
  setCurrentPeriod: function (newPeriod) {
    if (!this.currentPeriod) {
      // there must not have been any period set before at all
      this.currentPeriod = newPeriod.id;
    } else {
      const period = this.populated("currentPeriod");
      if (!period) {
        period = this.currentPeriod.id;
      }

      // set the new period as current
      this.currentPeriod = newPeriod.id;
      const incident = this; // cache the incident for later return from another function context

      // close the old period, open the new period
      Period.findById(period, function(err, oldPeriod) {
        if (err) throw new Error(err);

        oldPeriod.close(newPeriod);
        oldPeriod.save(function (err) {
          if (err) throw new Error("Failed to close previous operational period.");

          newPeriod.open(oldPeriod);
          newPeriod.save(function (err) {
            if (err) throw new Error("Failed to open new operational period.");

            return incident;
          });
        });
      });
    }
  }
};

// Static methods
IncidentSchema.statics = {
  // A helper function to execute a Mongoose query to fetch an Incident by ID.
  load: function(_id) {
    return this.findOne({_id})
      .populate("currentPeriod")
      .populate("user")
      .exec();
  },

  // A helper function to execute a Mongoose query to fetch a paged list of Incidents.
  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('currentPeriod', 'commander') // we want to de-reference the commander and include its name field
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('Incident', IncidentSchema);
