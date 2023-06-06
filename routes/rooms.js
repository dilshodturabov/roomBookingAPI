const express = require('express');
const router = express.Router();
const {validate, Room} = require('../models/room');

const ERROR_MESSAGE = "topilmadi";

router.get('/', async (req, res)=>{
	const room = await Room.find().select('- __v');
	let rooms = {
		page: 1,
		count: room.length,
		page_size: 10,
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