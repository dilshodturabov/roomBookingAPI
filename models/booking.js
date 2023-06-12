 const Joi = require('Joi');
 const mongoose = require('mongoose');

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

function validateBooking(booking){
	const bookingValidator = Joi.object({
    	resident: Joi.object({
    	    name: Joi.string().min(3).max(50).required().trim()
    	}),
    	start: Joi.date().default(Date.now),
    	end: Joi.date().required()
	});
	
	return bookingValidator.validate(booking);
}

exports.Booking = Booking;
exports.validateBooking = validateBooking;