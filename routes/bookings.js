const express = require('express');
const router = express.Router();
const { Room } = require('../models/room');
const { validateBooking, Booking } = require('../models/booking');

router.post('/:Id/book', async (req, res) => {
    const startTime = new Date(req.body.start);
    const endTime = new Date(req.body.end);
    const { error } = validateBooking(req.body);
    if (error)
        res.status(400).send(error.details[0].message);

    let room = await Room.findById(req.params.Id);
    if (!room)
        return res.status(404).send("Berilgan Id ga mos xona topilmadi!");


    const bookedRoom = await Booking.find({
        room: req.params.Id
    });
    

    if(bookedRoom.length !== 0 && startTime>=bookedRoom[0].start && startTime<=bookedRoom[0].end){
        res.status(410).send({error: 'uzr, siz tanlagan vaqtda xona band'});
    } else if(startTime < new Date() && endTime <= startTime){
        res.status(410).send({error: 'uzr, siz tanlagan vaqt oralig\'i noto\'ri!'});
    } else{
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
    }
});

router.get('/:Id/availability', async (req, res) => {
    const roomAvailability = await Booking.find({
            room: req.params.Id,
            start: { $gte: new Date() }

        })
        .select({ _id: 0, start: 1, end: 1 })

    return res.status(200).send(roomAvailability);
});

module.exports = router;