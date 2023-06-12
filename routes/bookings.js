const express = require('express');
const router = express.Router();
const {Room} = require('../models/room');
const {validateBooking, Booking}= require('../models/booking');

router.post('/:Id/book', async (req, res) => {
	const {error} = validateBooking(req.body);
	if(error)
		res.status(400).send(error.details[0].message);

	const room = await Room.findById(req.params.Id);
	if (!room) 
		return res.status(404).send("Berilgan Id ga mos xona topilmadi!");

	const booking = new Booking({
    room: room._id,
    resident: req.body.resident,
    start: req.body.start,
    end: req.body.end
    });
    
    await booking.save();
    
    res.send({
    	message: "xona muvaffaqiyatli band qilindi"
    });
});

router.get('/:Id/availability', async (req, res)=>{
	const roomAvailability = await Booking.find({
		room: req.params.Id,
	});

	return res.status(200).send(roomAvailability);
});

module.exports = router;