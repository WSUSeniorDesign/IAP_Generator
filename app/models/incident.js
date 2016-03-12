var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose schema guide: http://mongoosejs.com/docs/guide.html 

const IncidentSchema = new Schema({
  name: {type: String, required: true},
  location: String,
  // commander: {type: Schema.Types.ObjectId, ref: 'User'},
  active: {
    type: Boolean,
    // default to false because checkboxes are only sent by the browser if they're checked,
    // so if they check the Active box on the form, it will overwrite this value, and if they don't,
    // it will take the default value of false.
    default: false
  },
  createdAt: { type : Date, default : Date.now }
});

// Static methods
IncidentSchema.statics = {
  // A helper function to execute a Mongoose query to fetch an Incident by ID.
  load: function(_id) {
    return this.findOne({_id})
      // .populate('commander', 'name') // we want to de-reference the commander and include its name field
      .exec();
  },

  // A helper function to execute a Mongoose query to fetch a paged list of Incidents.
  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('commander', 'name') // we want to de-reference the commander and include its name field
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('Incident', IncidentSchema);
