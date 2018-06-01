const MONGOOSE = require('mongoose');
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const PRODUCT_SCHEMA = MONGOOSE.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: {
        type: Number,
        min: 0,
        max: Number.MAX_VALUE,
        default: 0
    },
    image: { type: Buffer },
    mime: { type: String },
    category: { type: OBJECT_ID, ref: 'Category' },
    isBought: { type: Boolean, default: false }
});

let Product = MONGOOSE.model('Product', PRODUCT_SCHEMA);

module.exports = Product;