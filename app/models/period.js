const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//
// Schema
//
const PeriodSchema = new Schema({
  incident: { type: Schema.Types.ObjectId, ref: "Incident", required: true },
  // commander: { type: Schema.Types.ObjectId, ref: "User", required: true },
  commander: { type: String, required: true },
  prevPeriod: { type: Schema.Types.ObjectId, ref: "Period" },
  nextPeriod: { type: Schema.Types.ObjectId, ref: "Period" },
  start: {
    date: { type: String, required: true },
    time: { type: String }
  },
  end: {
    date: { type: String, required: true },
    time: { type: String }
  },
  active: { type: Boolean, default: false }
});

//
// Instance Methods
//
PeriodSchema.methods = {
  close: function(nextPeriod) {
    if (nextPeriod) {
      this.nextPeriod = nextPeriod;
    }
    this.active = false;
    return this;
  },

  open: function(prevPeriod) {
    if (prevPeriod) {
      this.prevPeriod = prevPeriod;
    }
    this.active = true;
    return this;
  }
}

//
// Static Methods
//
PeriodSchema.statics = {
  load: function(_id) {
    return this.findOne({_id}).exec();
  }
}

//
// Register Model
//
mongoose.model("Period", PeriodSchema);
