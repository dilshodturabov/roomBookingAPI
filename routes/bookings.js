const express = require('express');
const router = express.Router();
const { Room } = require('../models/room');
const { validateBooking, Booking } = require('../models/booking');

router.post('/:Id/book', async (req, res) => {
    const { error } = validateBooking(req.body);
    if (error)
        res.status(400).send(error.details[0].message);

    let room = await Room.findById(req.params.Id);
    if (!room)
        return res.status(404).send("Berilgan Id ga mos xona topilmadi!");

    if(room.start <= req.body.start && room.end >= req.body.end)
    	return res.status(410).send({
  			"error": "uzr, siz tanlagan vaqtda xona band"
		});


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


// router.post('/:Id/book', async (req, res) => {
//     const roomId = req.params.Id;
//     const startTime = new Date(req.body.start);
//     const endTime = new Date(req.body.end);
//     let room = await Room.findById(req.params.Id);
//     if (!room)
//         return res.status(404).send("Berilgan Id ga mos xona topilmadi!");

//     const booking = await Booking.find({
//         roomId,
//         $and: [
//             { start: { $gte: startTime, $lt: endTime } },
//             { end: { $gt: startTime, $lte: endTime } }
//         ]
//     });

//     if (booking) {
//         res.status(410).send({ error: 'uzr, siz tanlagan vaqtda xona band' });
//     } else {
//         // time slot is available
//         const booking = new Booking({
//             room: room._id,
//             resident: req.body.resident,
//             start: startTime,
//             end: endTime
//         });

//         await booking.save();

//         res.send({ message: 'xona muvaffaqiyatli band qilindi' });
//     }
// });


router.get('/:Id/availability', async (req, res) => {
    const roomAvailability = await Booking.find({
            room: req.params.Id,
            // end: { $gte: new Date() }

        })
        .select({ _id: 0, start: 1, end: 1 })

    return res.status(200).send(roomAvailability);
});

module.exports = router;