const MONGOOSE = require('mongoose');
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const CATEGORY_SCHEMA = MONGOOSE.Schema({
    name: { type: String, required: true, unique: true },
    products: [{ type: OBJECT_ID, ref: 'Product' }]
});

let Category = MONGOOSE.model('Category', CATEGORY_SCHEMA);

module.exports = Category;