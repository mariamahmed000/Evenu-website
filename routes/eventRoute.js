const express = require('express');
const router = express.Router();
const eventController = require('../controller/eventController');
const multer = require('multer');
const upload = multer();
//#region
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventsById);
router.get('/getname/:name', eventController.getEventsByName);
router.post('/add', upload.single('image'),eventController.addEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// router.post('/:id/review', eventController.setReview);

module.exports = router;
