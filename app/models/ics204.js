const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ICS204Schema = new Schema({
  incident: { type: Schema.Types.ObjectId, ref: "Incident", required: true },
  period: { type: Schema.Types.ObjectId, ref: "Period", required: true },
  field3: { 
    branch: String, 
    division: String, 
    group: String, 
    stagingArea: String 
  },
  operationsPersonnel: { 
    operationsSectionChiefName: String, 
    operationsSectionChiefContactNumber: String,
    branchDirectorName: String,
    branchDirectorContactNumber: String,
    divisionGroupSupervisorName: String,
    divisionGroupSupervisorContactNumber: String,
  },
  resourcesAssigned: [{
    resourceIdentifier: String, 
    leader: String, 
    numOfPersons: String, 
    contact: String,
	notes: String
  }],
  workAssignments: String,
  specialInstructions: String,
  communications: [{
    name: String,
    function: String,
    primaryContact: String
  }],
  preparedBy: {
    name: String,
    positionTitle: String,
    signature: String,
    dateTime: String
  }
});

ICS204Schema.statics = {
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

mongoose.model("ICS204", ICS204Schema);
