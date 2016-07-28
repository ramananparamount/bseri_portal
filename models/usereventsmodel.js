var db = require('../util/db')
var mongoose = db.mongoose;
var Schema = db.schema;

// create a schema
var UserEventsSchema = new Schema({
	userid: { type: Schema.Types.ObjectId, ref: 'users' },
	eventref: [{ type: Schema.Types.ObjectId, ref: 'courseevents'}],
	status: { type: String, default:'Registered' },
	created_by: Schema.Types.ObjectId,
	updated_by: Schema.Types.ObjectId,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('userevents', UserEventsSchema);
