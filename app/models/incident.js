var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose schema guide: http://mongoosejs.com/docs/guide.html 

const IncidentSchema = new Schema({
  name: {type: String, required: true},
  location: String,
  commander: {type: Schema.Types.ObjectId, ref: 'User'},
  startDate: {type: Date, default: Date.now},
  endDate: Date,
  active: {type: Boolean, default: true},
  createdAt: { type : Date, default : Date.now }
});

// A helper function to execute a Mongoose query to fetch an Incident by ID.
IncidentSchema.statics.load = function(_id) {
  return this.findOne({_id})
    .populate('commander', 'name') // we want to de-reference the commander and include its name field
    .exec();
};

// A helper function to execute a Mongoose query to fetch a paged list of Incidents.
IncidentSchema.statics.list = function (options) {
  const criteria = options.criteria || {};
  const page = options.page || 0;
  const limit = options.limit || 30;
  return this.find(criteria)
    .populate('commander', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * page)
    .exec();
};

mongoose.model('Incident', IncidentSchema);
