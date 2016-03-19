const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ICS204Schema = new Schema({
  incidentId: { type: Schema.Types.ObjectId, required: true },
  operationalPeriod: { 
    start: Date, 
    end: Date 
  },
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
    numOfPersons: Number, 
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
    dateTime: Date
  }
});

ICS204Schema.statics = {
  // A helper function to execute a Mongoose query to fetch an Incident by ID.
  load: function(_id) {
    return this.findOne({_id})
      .exec();
  },

  loadByIncidentId: function(incidentId) {
    return this.find({incidentId: incidentId})
      .select('_id')
      .exec();
  }
};

mongoose.model("ICS204", ICS204Schema);
