const mongoose = require('mongoose');
const creditCardSchema = new mongoose.Schema({
	cardNum: {
		type: String,
		required: true,
		minlength: 16,
		maxlength: 16,
	},
	name: {
		type: String,
		required: true,
	},
	cvv: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 3,
	},
	month: {
		type: String,
		required: true,
	},
	year: {
		type: String,
		required: true,
	},
});
module.exports = mongoose.model('CreditCard', creditCardSchema);
