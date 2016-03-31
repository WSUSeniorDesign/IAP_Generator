const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ICS206Schema = new Schema({
  incident: { type: Schema.Types.ObjectId, ref: "Incident", required: true },
  period: { type: Schema.Types.ObjectId, ref: "Period", required: true },
  medicalAidStations: [{
	name: String,
	location: String,
	contact: String,
	paramedics: Boolean
  }],
  transportation: [{
	ambulance: String,
	location: String,
	contact: String,
	isLevelALS: Boolean
  }],
  hospitals: [{
	name: String,
	addressLatLong: String,
	contact: String,
	airTravelTime: String,
	groundTravelTime: String,
	traumaCenterbool: Boolean,
	traumaCenterLevel: Number,
	burnCenter: Boolean,
	helipad: Boolean
  }],
  specMedEmerProc: String,
  preparedBy: {
    name: String,
    signature: String
  },
  approvedBy: {
	name: String,
	signature: String,
	dateTime: String
  }
});

ICS206Schema.statics = {
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