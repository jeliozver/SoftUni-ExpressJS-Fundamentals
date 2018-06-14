const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const BOOLEAN = MONGOOSE.Schema.Types.Boolean;
const DATE = MONGOOSE.Schema.Types.Date;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const CAR_SCHEMA = MONGOOSE.Schema({
    carModel: { type: STRING, required: true },
    image: { type: STRING, required: true },
    description: { type: STRING, required: true },
    pricePerDay: { type: NUMBER, required: true },
    class: { type: OBJECT_ID, ref: 'Class', required: true },
    isRented: { type: BOOLEAN, default: false },
    rentExpireDate: { type: DATE },
    expireDateFormated: { type: STRING }
});

const CAR = MONGOOSE.model('Car', CAR_SCHEMA);

module.exports = CAR;