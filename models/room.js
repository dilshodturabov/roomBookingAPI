const mongoose = require('mongoose');
const Joi = require('Joi');
const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		maxlength: 50,
		required: true,
		trim: true
	},
	type:{
		type: String,
		enum: ["focus", "team", "reference"],
	},
	capacity:{
		type:Number,
		required: true
	}
});

const Room = new mongoose.model('Room', roomSchema);

function validateRoom(room){
	const roomSchema = Joi.object({
		name: Joi.string().required().min(3).max(50),
		type: Joi.string().required().valid("focus", "team", "reference"),
		capacity: Joi.number().required()		
	});
	
	return roomSchema.validate(room);
}

exports.validate = validateRoom;
exports.Room = Room;
exports.roomSchema = roomSchema;