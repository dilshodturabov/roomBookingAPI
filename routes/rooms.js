const express = require('express');
const router = express.Router();
const Joi = require('Joi');
const mongoose = require('mongoose');
const {validate, Room} = require('../models/room');

const ERROR_MESSAGE = "topilmadi";

router.get('/', async (req, res)=>{
	let {page, limit} = req.query;
	if(page === undefined){
		page = 1;
		limit = 3;
	} else if(limit === undefined){
		limit = 3;
	}
	const skip = (page - 1) * limit;
	const room = await Room.find().skip(skip).limit(limit).select({name: 1, type: 1, capacity: 1});
	const allRooms = await Room.find();
	let rooms = {
		page:  parseInt(page),
		count: room.length,
		page_size: Math.ceil(allRooms.length / limit),
		results: room
	}
	res.status(200).send(rooms);
});

router.post('/', async (req,res)=>{
	const {error} = validate(req.body);
	if(error)
		res.status(400).send(error.details[0].message);


	let room = new Room({
		name: req.body.name,
		type: req.body.type,
		capacity: req.body.capacity
	});

	room = await room.save();
	res.status(201).send(room);
});

router.get('/:Id', async (req, res)=>{
    try{
    	const room = await Room.findById(req.params.Id).select({name: 1, type: 1, capacity: 1});
    	if(!room)
        	res.status(404).send("IDga mos xona topilmadi!")
    
    	res.send(room);
    }	catch(error){
    	return res.status(404).send({
    		error: "topilmadi"
    	});
    }

});

const bookingSchema = new mongoose.Schema({
	resident: {
		name: {
			type: String,
			minlength: 3,
			maxlength: 50,
			required: true,
			trim: true
		}
	},
	room: { 
		type: String,
		required: true
	},

	start: {
		type: Date,
		default: Date.now 
	},
	end: {
		type: Date,
		required: true
	}
});

const Booking = new mongoose.model('Booking', bookingSchema);

function validateRoom(booking){
	const bookingValidator = Joi.object({
    	resident: Joi.object({
    	    name: Joi.string().min(3).max(50).required().trim()
    	}),
    	start: Joi.date().default(Date.now),
    	end: Joi.date().required()
	});
	
	return bookingValidator.validate(booking);
}

router.post('/:Id/book', async (req, res) => {
	const {error} = validateRoom(req.body);
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
    
    res.send(booking);
});

module.exports = router;