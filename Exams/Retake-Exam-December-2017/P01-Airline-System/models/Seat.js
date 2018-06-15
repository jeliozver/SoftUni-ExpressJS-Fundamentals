const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const SEAT_SCHEMA = MONGOOSE.Schema({
    price: { type: NUMBER, required: true },
    type: { type: STRING, required: true },
    freeSeats: { type: NUMBER, required: true },
    flight: { type: OBJECT_ID, ref: 'Flight'}
});

const SEAT = MONGOOSE.model('Seat', SEAT_SCHEMA);

module.exports = SEAT;