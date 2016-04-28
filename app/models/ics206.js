const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ICS206Schema = new Schema({
  incident: { type: Schema.Types.ObjectId, ref: "Incident", required: true },
  period: { type: Schema.Types.ObjectId, ref: "Period", required: true },
  medicalAidStations: [{
    name: String,
    location: String,
    contact: String,
    paramedics: { type: Boolean, default: false }
  }],
  transportation: [{
    ambulance: String,
    location: String,
    contact: String,
    level: String
  }],
  hospitals: [{
    name: String,
    addressLatLong: String,
    contact: String,
    airTravelTime: String,
    groundTravelTime: String,
    traumaCenter: { type: Boolean, default: false },
    traumaCenterLevel: String,
    burnCenter: { type: Boolean, default: false },
    helipad: { type: Boolean, default: false }
  }],
  specMedEmerProc: String,
  preparedBy: {
    name: String,
    signature: String
  },
  approvedBy: {
  name: String,
  signature: String,
  dateTime: { type: [String, "Section 8: Date must be a valid date."] }
  }
});

ICS206Schema.statics = {
  title: function() { return "Medical Plan (ICS 206)"; },
  
  fieldMask: function() {
    return [
      "medicalAidStations",
      "transportation",
      "hospitals",
      "specMedEmerProc",
      "preparedBy",
    ];
  },

  new: function(values) {
    values.medicalAidStations.forEach(function (station) {
      station.paramedics = (station.paramedics === "yes") ? true : false;
    });

    values.hospitals.forEach(function (hospital) {
      hospital.burnCenter = (hospital.burnCenter === "yes") ? true : false;
      hospital.helipad = (hospital.helipad === "yes") ? true : false;
    });

    return new this(values);
  },

  // A helper function to execute a Mongoose query to fetch an Incident by ID.
  load: function(_id) {
    return this.findOne({_id})
      .populate("period")
      .exec();
  },

  loadByIncidentId: function(incidentId) {
    return this.find({incident: incidentId})
      .select('_id')
      .exec();
  },

  loadByPeriodId: function(periodId) {
    return this.find({period: periodId})
      .select('_id')
      .exec();
  }
};

mongoose.model("ICS206", ICS206Schema);