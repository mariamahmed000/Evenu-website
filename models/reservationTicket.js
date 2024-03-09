const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	events: [{
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
		totalQuantity:{
			type:Number,
		},
       ticketInfo: [
		{
			quantity: {
            type: Number,
            required: true,
        },
		type: {
            type: String,
            required: true,
        }
	}],
		totalPrice:{
			type:Number
		},
		dateTime: {
			day: { type: String },
			start: { type: String },
			end: { type: String }
		}
    }],
	totalPrice: {
		type: Number,
		required: true,
	},
	totalQuantity:{
		type: Number,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	isPurchased:{
		type:Boolean
	},
});

module.exports = mongoose.model('Reservation', reservationSchema);

// ticket{
	
// 	[type,
// 	quantity]
// }

