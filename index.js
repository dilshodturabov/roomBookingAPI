const express = require('express');
const mongoose = require('mongoose');
const app = express();
const roomsRoute = require('./routes/rooms');
const bookingsRoute = require('./routes/bookings');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/rooms', roomsRoute);
app.use('/api/rooms', bookingsRoute);

const urlToDatabase = "mongodb://127.0.0.1:27017/roomBooking";
mongoose.connect(urlToDatabase, {useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=> console.log('database connected...'))
    .catch(err=>console.log('Program crashed on connecting to database!', err))




const port = process.env.PORT || 5001;

app.listen(port,()=>{
    console.log(`${port} - port listening...`);
});