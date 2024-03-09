const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	image:{
		
	},
	location: {
		type: String,
		required: true,
	},
	facilities: [
		{
			type: String,
			// required: true,
		},
	],
	organizer: {
		type: String,
		required: true,
	},
	
	Description: {
		type: String,
		required: true,
	},
	tickets: [
		{
			type: {
				type: String,
				// required: true,
			},
			reserved: {
				type: Number,
				// required: true,
			},
			price: {
				type: Number,
				// required: true,
			},
			totalTickets: {
				type: Number,
				// required: true,
			},
		},
	],
	dates: [
		{
			date: { type: String, 
				// required: true
			 }, //regular
			times: [
				{
					start: {
						type: String,
						// required: true,
					}, //price
					end: {
						type: String,
						// required: true,
					}, //total ,res
					_id: false,
				},
			],
			_id: false,
		},
		
	],
	instructions: [
		{
			type: String,
		},
	],
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

// const scheduleSchema = new Schema({
//   dates: [dateSchema]
// });
module.exports = mongoose.model('Event', eventSchema);
