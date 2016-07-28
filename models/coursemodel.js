var db = require('../util/db')
var mongoose = db.mongoose;
var Schema = db.schema;

// create a schema
var CourseSchema = new Schema({
  title: { type: String, required: true, unique: true },
  keyword: { type: String, required: true, unique: true },
  briefdesc: { type: String, required: true },
  smallimage: { type: String, required: true },
  midimage: { type: String, required: true },
  largeimage: String,
  coursedesc1: { type: String, required: true },
  coursedesc2: String,
  coursedesc3: String,
  promo: String,
  promotype:String,
  promofiletype:String,
  created_by: Schema.Types.ObjectId,
  updated_by: Schema.Types.ObjectId,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('courses', CourseSchema);
