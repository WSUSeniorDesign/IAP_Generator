const only = require("only");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ICS204Schema = new Schema({
  incident: { type: Schema.Types.ObjectId, ref: "Incident", required: true },
  period: { type: Schema.Types.ObjectId, ref: "Period", required: true },
  user: {type: Schema.Types.ObjectId, ref: 'User' },
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
  title: function() { return "Assignment List (ICS 204)"; },

  fieldMask: function() {
    return [
      'field3',
      'operationsPersonnel',
      'resourcesAssigned',
      'workAssignments',
      'specialInstructions',
      'communications',
      'preparedBy'
    ];
  },

  new: function(values) {
    return new this(values);
  },

  // A helper function to execute a Mongoose query to fetch an Incident by ID.
  load: function(_id) {
    return this.findOne({_id})
      .populate("period")
      .populate("user")
      .exec();
  },

  loadByIncidentId: function(incidentId) {
    return this.find({incident: incidentId})
      .populate("user")
      .select('_id')
      .select("user")
      .exec();
  },

  loadByPeriodId: function(periodId) {
    return this.find({period: periodId})
      .populate("user")
      .select('_id')
      .select("user")
      .exec();
  }
};

mongoose.model("ICS204", ICS204Schema);
