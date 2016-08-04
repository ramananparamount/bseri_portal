var db = require('../util/db')
var mongoose = db.mongoose;
var Schema = db.schema;

// create a schema
var JunctionCategorySchema = new Schema({
	categoryid: { type: Number, required: true, unique: true },
	categoryName: { type: String, required: true },
	categoryDesc: { type: String, required: true },
	status: { type: String, default:'active' },
	created_by: Schema.Types.ObjectId,
	updated_by: Schema.Types.ObjectId,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('junctioncategories', JunctionCategorySchema);
