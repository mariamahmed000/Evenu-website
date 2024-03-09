const userModel = require('../models/userModel');
const eventController = require('../controller/eventController');
const reservationController = require('./reservationController');
const Event = require('../models/eventModel');
const Review = require('../models/reviewModel');
const reservationModel = require('../models/reservationTicket');
var bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');


const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store the image in memory (you can customize this)
const upload = multer({ storage: storage });

let getAllUser = async (req, res) => {
	let users = await userModel.find({});
	if (users) {
		res.status(200).json({ message: "success", length: users.length, data: users });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};

let userReserve = async (req, res) => {
	const userId = req.params.id;
	const reservationData = req.body;
	console.log(reservationData)
	try {
		let totalPrice = 0;
		let totalQuantity = 0;
		const reservationDetails = [];

		for (const event of reservationData) {

			const eventData = await eventController.getEventsByIdRes(event.eventId);
			if (!eventData) {
				return res.status(404).json({ message: 'Event not found' });
			}
			const eventTotalPrice = await reservationController.calculateTotalPrice(eventData, event.tickets);
			const eventTotalQuantity = await reservationController.calculateTotalQuantity(eventData, event.tickets);

			if (eventTotalPrice === -1) {
				return res.status(400).json({ message: 'Not enough tickets available' });
			}
			totalPrice += eventTotalPrice;
			totalQuantity += eventTotalQuantity;
			reservationDetails.push({
				eventId: event.eventId,
				ticketInfo: event.tickets,
				totalPrice: eventTotalPrice,
				totalQuantity: eventTotalQuantity,
				dateTime: event.dateTime
			});
		}

		await reservationController.updateEventAndCreateReservations(userId, reservationData, reservationDetails, totalPrice, totalQuantity);
		res.status(200).json({ message: 'Your transacion has been successfully completed', totalPrice: totalPrice, reservationDetails: reservationDetails });
	} catch (error) {
		console.error('Error reserving tickets:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};


let getUserById = async (req, res) => {
	try {
		const ID = req.params.id;
		let user = await userModel.findOne({ _id: ID });
		res.status(200).json({ message: "success", data: user });
	}

	catch (err) {
		res.status(404).json({ message: err });
	}
};
let addUser = async (req, res) => {
	try {
		let newUser = req.body;
		console.log('new userrrrrrrr', newUser);
		const existingUser = await userModel.findOne({ email: newUser.email });

		if (existingUser) {
			return res.status(400).json({ message: 'Email already exists' });
		}
		const imageResponse = await uploadImage(req, res);
		newUser.image = imageResponse;
		const user = new userModel(newUser);
		console.log(imageResponse);
		console.log(newUser);
		await user.save();
		res.status(201).json({ message: 'success', data: newUser });
	}
	catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Server Error' });
	}
};
let updateUser = async (req, res) => {
	const ID = req.params.id;
	const data = req.body;
	let user = await userModel.findOneAndUpdate({ _id: ID }, data, {
		new: true,
	});
	if (user) {
		res.status(200).json({ data: user });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};
let deleteUser = async (req, res) => {
	const ID = req.params.id;
	let user = await userModel.findOneAndDelete({ _id: ID });
	if (user) {
		res.status(200).json({ message: 'success' });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};

let loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if the user exists with the provided email
		const user = await userModel.findOne({ email });

		if (user) {
			// User exists, now check if the password matches
			const isPasswordMatch = await bcrypt.compare(password, user.password);

			if (isPasswordMatch) {
				// Passwords match, generate a JWT token
				const token = jwt.sign({ userId: user._id, role: user.role }, 'secrmjcret', { expiresIn: '1h' });

				// Return the token in the response
				return res.status(200).json({ message: 'success', token, email: user.email, id: user._id, role: user.role });
			} else {
				// Passwords do not match
				return res.status(401).json({ success: false, message: 'Invalid credentials' });
			}
		} else {
			// User does not exist
			return res.status(401).json({ success: false, message: 'Invalid credentials' });
		}
	} catch (error) {
		console.error('Error checking credentials:', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};


let submitReview = async (req, res) => {
	const data = req.body;
	const ID = req.params.id;
	try {
		const review = new Review({
			eventId: data.eventId,
			userId: ID,
			rating: data.rating,
			comment: data.comment,
		});
		await review.save();
		// Add the review ObjectId to the event's reviews array
		await Event.findByIdAndUpdate(data.eventId, {
			$push: { reviews: review._id },
		});
		await userModel.findByIdAndUpdate(ID, {
			$push: { reviews: review._id },
		});

		res.status(200).json({ message: 'success', date: review });
	} catch (error) {
		res.status(404).json({ message: 'fail' });
	}

};

let getReview = async (req, res) => {
	try {
		// const ID = req.params.id;
		let user = await Review.find({}).populate('userId');
		res.status(200).json({ message: "success", data: user });
	}

	catch (err) {
		console.log(err);
		res.status(404).json({ message: err });
	}
}


let uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			// return path.join(__dirname, '..', 'uploads/user.jpg');
			return 'user.jpg';
		}
		// Access the uploaded image data using req.file.buffer
		const imageBuffer = req.file.buffer;
		// Generate a unique filename
		const filename = Date.now() + '-' + req.file.originalname;
		// Define the path where you want to save the image
		const filePath = path.join(__dirname, '..', 'uploads', filename);
		await fs.promises.writeFile(filePath, imageBuffer);
		return filename;
	} catch (err) {
		return { error: err };
	}
}
// exports
module.exports = {
	getAllUser,
	getUserById,
	addUser,
	updateUser,
	deleteUser,
	userReserve,
	submitReview,
	getReview,
	loginUser

};