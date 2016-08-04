var db = require('../util/db')
var mongoose = db.mongoose;
var Schema = db.schema;

// create a schema
var JunctionDetailsSchema = new Schema({
	category: { type: Schema.Types.ObjectId, ref:"junctioncategories" },
	seq: { type: Number, required: true},
	title: String,
	briefdesc: String,
	detaildesc: String,
	detailslink: { type: String, default:'' },
	status: { type: String, default:'active' },
	created_by: Schema.Types.ObjectId,
	updated_by: Schema.Types.ObjectId,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('junctiondetails', JunctionDetailsSchema);
