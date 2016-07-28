var db = require('../util/db')
var mongoose = db.mongoose;
var Schema = db.schema;

// create a schema
var HomeSliderSchema = new Schema({
  seq: { type: Number, required: true, unique: true },
  media: { type: String, default: 'image' },
  image: { type: String, required: true },
  video: String,
  type: String,
  title: String,
  detailslink: String,
  status: { type: String, default:'active' },
  created_by: Schema.Types.ObjectId,
  updated_by: Schema.Types.ObjectId,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
},{collection:'homeslider'});

module.exports = mongoose.model('homeslider', HomeSliderSchema);
