const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const DATE = MONGOOSE.Schema.Types.Date;
const BOOLEAN = MONGOOSE.Schema.Types.Boolean;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const FLIGHT_SCHEMA = MONGOOSE.Schema({
    destination: { type: STRING, required: true, uppercase: true},
    origin: { type: STRING, required: true },
    date: { type: DATE, required: true },
    time: { type: STRING, required: true },
    image: { type: STRING, required: true },
    public: { type: BOOLEAN, default: false },
    seats: [{ type: OBJECT_ID, ref: 'Seat' }]
});

const FLIGHT = MONGOOSE.model('Flight', FLIGHT_SCHEMA);

module.exports = FLIGHT;

module.exports.init = () => {
    FLIGHT.findOne({destination: 'CLUJ-NAPOCA'}).then((flight) => {
        if (!flight) {
            FLIGHT.create({
                destination: 'CLUJ-NAPOCA',
                origin: 'Sheffield',
                date: Date.now(),
                time: '14:00',
                image: '/img/Sheffield.png'
            });
        }
    });

    FLIGHT.findOne({destination: 'BUCHAREST'}).then((flight) => {
        if (!flight) {
            FLIGHT.create({
                destination: 'BUCHAREST',
                origin: 'Sheffield',
                date: Date.now(),
                time: '12:00',
                image: '/img/Sheffield.png'
            });
        }
    });

    FLIGHT.findOne({destination:'TIMISOARA'}).then((flight) => {
        if (!flight) {
            FLIGHT.create({
                destination: 'TIMISOARA',
                origin: 'Sheffield',
                date: Date.now(),
                time: '18:00',
                image: '/img/Sheffield.png'
            });
        }
    });
};