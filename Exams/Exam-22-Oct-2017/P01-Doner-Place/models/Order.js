const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const DATE = MONGOOSE.Schema.Types.Date;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const ORDER_SCHEMA = MONGOOSE.Schema({
    creator: { type: OBJECT_ID, ref: 'User' },
    product: { type: OBJECT_ID, ref: 'Product' },
    toppings: [{ type: STRING }],
    date: { type: DATE, default: Date.now },
    status: { type: STRING, default: 'Pending' }
});

const ORDER = MONGOOSE.model('Order', ORDER_SCHEMA);

module.exports = ORDER;