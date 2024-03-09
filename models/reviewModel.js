const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
	eventId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
		// required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		// required: true,
	},
	rating: {
		type: Number,
		// required: true,
	},
	comment: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model('Review', reviewSchema);
