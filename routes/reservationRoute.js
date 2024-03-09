const express = require('express');
const router = express.Router();
const reservationController = require('../controller/reservationController');
//#region
router.get('/', reservationController.getAllReservation);
router.get('/:id', reservationController.getAllReservationByUserId);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);
// router.get('/:id', reservationController.getAllReservation);
// router.get('/:id', reservationController.getAllReservationByUserId);
// router.get('/:id', reservationController.getUserById);
// router.post('/:id/res', reservationController.userReserve);
// router.post('/:id/review', reservationController.submitReview);
// router.post('/add', reservationController.addUser);
// router.post('/login', reservationController.loginUser);
// router.patch('/:id', reservationController.updateReservation);
router.patch('/:id', reservationController.deleteSpecificReservation);
module.exports = router;
