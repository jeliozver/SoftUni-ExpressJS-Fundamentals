const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const TICKET_SCHEMA = MONGOOSE.Schema({
    flight: { type: OBJECT_ID, ref: 'Flight' },
    seat: { type: OBJECT_ID, ref: 'Seat' },
    type: { type: STRING, required: true },
    pricePerSeat: { type: NUMBER, required: true },
    bookedSeats: { type: NUMBER, required: true },
    total: { type: NUMBER, required: true }
});

const TICKET = MONGOOSE.model('Ticket', TICKET_SCHEMA);

module.exports = TICKET;