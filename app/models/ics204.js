var mongoose = require('mongoose');

var ICS204Schema = mongoose.Schema({
  incidentName: String,
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
    operationsSectionChiefContactNumber: Number,
    branchDirectorName: String,
    branchDirectorContactNumber: Number,
    divisionGroupSupervisorName: String,
    divisionGroupSupervisorContactNumber: Number,
  },
  resourcesAssigned: [{
    resourceIdentifier: String, 
    leader: String, 
    numOfPersons: Number, 
    Contact: String
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

mongoose.model("ICS204", ICS204Schema);
