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
		type: Number,
		required: true
	},

	start: {
		type: String,
		required: true
	},
	end: {
		type: String,
		required: true
	}
});

const Booking = new mongoose.model('Booking', bookingSchema);

function validateBooking(booking){
	const bookingValidator = Joi.object({
    	resident: Joi.object({
    	    name: Joi.string().min(3).max(50).required().trim()
    	}),
    	start: Joi.string().regex(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/),
    	end: Joi.string().required()
	});
	
	return bookingValidator.validate(booking);
}

exports.Booking = Booking;
exports.validateBooking = validateBooking;