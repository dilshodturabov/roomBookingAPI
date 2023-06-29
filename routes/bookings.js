const express = require('express');
const router = express.Router();
const { Room } = require('../models/room');
const { validateBooking, Booking } = require('../models/booking');

router.post('/:Id/book', async (req, res) => {
    const startTime = req.body.start;
    const endTime = req.body.end;

    const { error } = validateBooking(req.body);
    if (error)
        res.status(400).send(error.details[0].message);

    let room = await Room.find({ id: req.params.Id });

    const bookedRoom = await Booking.find({
        room: req.params.Id
    });

    if (bookedRoom.length !== 0) {
        for (let roomB of bookedRoom) {
            if ((roomB.start >= startTime && endTime >= roomB.start) || (roomB.end > startTime && roomB.end <= endTime)) {
                return res.status(410).send({ error: 'uzr, siz tanlagan vaqtda xona band' });
            }
        }
    }
    const booking = new Booking({
        room: req.params.Id,
        resident: req.body.resident,
        start: req.body.start,
        end: req.body.end
    });

    await booking.save();

    res.status(201).send({
        message: "xona muvaffaqiyatli band qilindi"
    });
});









router.get('/:Id/availability', async (req, res) => {
  const { date } = req.query;
  const roomId = req.params.Id;

  let queryDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

  const bookings = await Booking.find({
    roomId: roomId,
    start: { $gte: startOfDay },
    end: { $lte: endOfDay }
  }).select({ _id: 0, start: 1, end: 1 });

  let availableSlots = [];
  let currentTime = startOfDay;
  bookings.forEach(booking => {
    if (booking.start > currentTime) {
      availableSlots.push({ start: currentTime, end: booking.start });
    }
    currentTime = booking.end;
  });
  if (currentTime < endOfDay) {
    availableSlots.push({ start: currentTime, end: endOfDay });
  }

  return res.status(200).send(availableSlots);
});






// router.get('/:Id/availability', async (req, res) => {
//     const {date} = req.query;

//     let query = {};
//     if (date) {
//         query = {start: new RegExp(date, 'i')};
//     }else{
//         query = {start: new RegExp(new Date(), 'i')};
//     }

//     const roomsBusyTime = await Booking.find(query).select({_id: 0, start: 1, end: 1});


//     return res.status(200).send(roomsBusyTime);
// });

module.exports = router;