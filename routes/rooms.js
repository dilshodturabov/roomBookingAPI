const express = require('express');
const router = express.Router();
const Joi = require('Joi');
const mongoose = require('mongoose');
const {validate, Room} = require('../models/room');
const {validateBooking, Booking}= require('../models/booking');


router.get('/', async (req, res) => {
  let { page, page_size, search, type} = req.query;
  if (page === undefined) {
    page = 1;
    page_size = 3;
  } else if (page_size === undefined) {
    page_size = 3;
  }
  const skip = (page - 1) * page_size;

  let query = {};
  if (search) {
    query = { name: new RegExp(search, 'i') };
  }
  if(type){
  	query = {type: new RegExp(type, 'i')};
  }

  const room = await Room.find(query)
    .skip(skip)
    .limit(page_size)
    .select({ id: 1, _id: 0, name: 1, type: 1, capacity: 1 });
  const allRooms = await Room.find(query);
  let rooms = {
    page: parseInt(page),
    count: room.length,
    page_size: Math.ceil(allRooms.length / page_size),
    results: room,
  };
  res.status(200).send(rooms);
});

router.get('/:Id', async (req, res) => {
  const id = parseInt(req.params.Id);
  const room = await Room.findOne({ id: id }).select({_id: 0, id: 1, name: 1, type: 1, capacity: 1});
  if (room) {
    res.status(200).json(room);
  } else {
    res.status(404).json({ error: 'topilmadi' });
  }
});

module.exports = router;