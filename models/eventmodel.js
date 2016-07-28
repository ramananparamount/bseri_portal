var db = require('../util/db')
var mongoose = db.mongoose;
var Schema = db.schema;


var EventsSchema = new Schema({
  eventid:{ type: Number, required: true, unique: true },
  course: { type: Schema.Types.ObjectId, ref: 'courses' },
  startdate: { type: Date, required: true, unique: true },
  enddate: { type: Date, required: true, unique: true },
  duration: String,
  isImportant: { type: Boolean, default: false },
  isTutorAvl: { type: Boolean, default: false },
  conductingOrg: String,
  Trainer: String ,
  Price: String,
  location: String,
  phone: String,
  email:String,
  created_by: Schema.Types.ObjectId,
  updated_by: Schema.Types.ObjectId,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('courseevents', EventsSchema);
