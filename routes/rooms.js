const express = require('express');
const router = express.Router();
const {validate, Room} = require('../models/room');

const ERROR_MESSAGE = "topilmadi";

router.get('/', async (req, res)=>{
	const {page, limit} = req.query;
	const skip = (page - 1) * limit;
	const room = await Room.find().skip(skip).limit(limit);
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
		id: req.body.id,
		name: req.body.name,
		type: req.body.type,
		capacity: req.body.capacity
	});

	room = await room.save();
	res.status(201).send(room);
});

router.get('/:Id', async (req, res)=>{
    try{
    	const room = await Room.findById(req.params.Id);
    	if(!room)
        	throw new Error("topilmadi");
    
    	res.send(room);
    }	catch(error){
    	return res.status(404).send({
    		error: "topilmadi"
    	});
    }

});

module.exports = router;