const eventModel = require('../models/eventModel');
// const ticketModel=require("../models/ticketModel");
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store the image in memory (you can customize this)
const upload = multer({ storage: storage });
let getEvents = async (req, res) => {
	let events = await eventModel.find({});
	if (events) {
		res.status(200).json({
			length: events.length,
			data: events,
            message: 'success'
		});
	} else {
		res.status(404).json({ message: 'fail' });
	}
};

let getEventsByName = async (req, res) => {
  let name = req.params.name;
	let events = await eventModel.find({title:name});
	if (events) {
		res.status(200).json({
			result: events.length,
			data: events,
      message: 'success'
		});
	} else {
		res.status(404).json({ message: 'fail' });
	}
};


let getEventsByIdRes = async id => {
	try {
		let event = await eventModel.findOne({ _id: id });
		if (event) {
			return event;
		} else {
			return { message: 'cant get event with this id' };
		}
	} catch (err) {
		console.log(err);
	}
};


let getEventsById = async (req, res) => {
	try {
		const ID = req.params.id;
		let event = await eventModel.findOne({ _id: ID });
		res.status(200).json({ data: event });
	}
	catch (err) {
		console.log(err);
		res.status(404).json({ message: 'fail' });
	}
};


let addEvent = async (req, res) => {
	try {

		let myEvent = req.body;
		const imageResponse = await uploadImage(req,res);
		myEvent.image = imageResponse;
		console.log(myEvent);
		myEvent = new eventModel(myEvent);
		myEvent.save();
		res.status(201).json({ message: 'success', data: myEvent });
		
	} catch (err) {
		console.log(err);
		res.status(404).json({ message: 'fail' });
	}
};

let updateEvent = async (req, res) => {
	const ID = req.params.id;
	const data = req.body;
	let event = await eventModel.findOneAndUpdate({ _id: ID }, data, {
		new: true,
	});
	if (event) {
		res.status(200).json({ data: event });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};


let deleteEvent = async (req, res) => {
	const ID = req.params.id;
	let event = await eventModel.findOneAndDelete({ _id: ID });
	if (event) {
		res.status(200).json({ message: 'success' });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};


let uploadImage = async(req, res) => {
	try {
	  if (!req.file) {
		return "user.jpg"
	  }
	  // Access the uploaded image data using req.file.buffer
	  const imageBuffer = req.file.buffer;
	  // Generate a unique filename
	  const filename = Date.now()+'-'+ req.file.originalname;
	  // Define the path where you want to save the image
	  const filePath = path.join(__dirname,'..', 'uploads', filename);
	await fs.promises.writeFile(filePath, imageBuffer);
	return filename;
	} catch (err) {  
	return{ error:err};
	}
}


module.exports = {
	getEvents,
	getEventsById,
	addEvent,
	updateEvent,
	deleteEvent,
	getEventsByIdRes,
  getEventsByName,
};