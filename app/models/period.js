const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PeriodSchema = new Schema({
  incident: { type: Schema.Types.ObjectId, ref: "Incident", required: true },
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

mongoose.model("Period", PeriodSchema);
