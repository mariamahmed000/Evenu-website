const eventModel = require('../models/eventModel');
const reservationTicket = require('../models/reservationTicket');
const reservationModel = require('../models/reservationTicket');

let getAllReservation = async (req, res) => {
	let reservations = await reservationModel.find({}).populate('events.eventId');
	if (reservations) {
		res.status(200).json({ message: "success", length: reservations.length, data: reservations });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};
let getAllReservationByUserId = async (req, res) => {
	const ID = req.params.id;
	let reservations = await reservationModel.find({ userId: ID }).populate('events.eventId');
	if (reservations) {
		res.status(200).json({ message: "success", length: reservations.length, data: reservations });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};
let updateReservation = async (req, res) => {
	const ID = req.params.id;
	const data = req.body;
	//in frontend in from group add isPurchased true
	let user = await userModel.findOneAndUpdate({ _id: ID }, data, {
		new: true,
	});
	if (user) {
		res.status(200).json({ data: user });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};

async function updateEventAndCreateReservations(userId, reservationData, reservationDetails, totalPrice, totalQuantity) {
	try {
		for (const event of reservationData) {
			const eventData = await eventModel.findById(event.eventId);
			if (!eventData) {
				throw new Error(`Event with ID ${event.eventId} not found`);
			}

			for (const ticket of event.tickets) {
				const ticketType = ticket.type;
				const ticketQuantity = ticket.quantity;

				const eventTicket = eventData.tickets.find(t => t.type === ticketType);
				if (!eventTicket || eventTicket.totalTickets < ticketQuantity) {
					throw new Error(`Not enough tickets available for event ${event.eventId}`);
				}

				eventTicket.totalTickets -= ticketQuantity;
				eventTicket.reserved += ticketQuantity;
				await eventData.save();
			}
		}
		const reservation = new reservationModel({
			userId: userId,
			events: reservationDetails,
			totalPrice: totalPrice,
			totalQuantity: totalQuantity,
			timestamp: new Date(),
			isPurchased: false,
		});
		await reservation.save();
	}
	catch (err) {
		console.error(err);

	}

}
function calculateTotalPrice(event, tickets) {
	let totalPrice = 0;

	for (const ticketInfo of tickets) {
		console.log(tickets);
		const ticket = event.tickets.find(t => t.type === ticketInfo.type);
		if (!ticket || ticket.totalTickets < ticketInfo.quantity) {
			return -1;
		}
		totalPrice += ticketInfo.quantity * ticket.price;
	}
	return totalPrice;
}
function calculateTotalQuantity(event, tickets) {
	let totalQuantity = 0;

	for (const ticketInfo of tickets) {
		const ticket = event.tickets.find(t => t.type === ticketInfo.type);
		if (!ticket || ticket.totalTickets < ticketInfo.quantity) {
			return -1;
		}
		totalQuantity += ticketInfo.quantity;
	}
	return totalQuantity;
}
let deleteReservation = async (req, res) => {
	const ID = req.params.id;
	let reservation = await reservationModel.findOneAndDelete({ _id: ID });
	if (reservation) {
		res.status(200).json({ message: 'success' });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};
let deleteSpecificReservation = async (req, res) => {
	const ID = req.params.id;
	const data = req.body;
	console.log(data);
	//in frontend in from group add isPurchased true
	let reservedTicket = await reservationTicket.findOneAndUpdate({ _id: ID }, data, {
		new: true,
	});

	if (reservedTicket) {
		res.status(200).json({ data: reservedTicket });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};


module.exports = {
	updateEventAndCreateReservations,
	calculateTotalPrice,
	getAllReservation,
	getAllReservationByUserId,
	deleteSpecificReservation,
	updateReservation,
	calculateTotalQuantity,
	deleteReservation
};