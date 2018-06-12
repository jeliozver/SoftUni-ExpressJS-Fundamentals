const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const CATEGORY_SCHEMA = MONGOOSE.Schema({
    name: { type: STRING, required: true, unique: true },
    products: [{ type: OBJECT_ID, ref: 'Product' }]
});

const CATEGORY = MONGOOSE.model('Category', CATEGORY_SCHEMA);

module.exports = CATEGORY;

module.exports.init = () => {
    CATEGORY.findOne({ name: 'Chicken' }).then((category) => {
        if (!category) {
            CATEGORY.create({ name: 'Chicken' });
        }
    });

    CATEGORY.findOne({ name: 'Lamb' }).then((category) => {
        if (!category) {
            CATEGORY.create({ name: 'Lamb' });
        }
    });

    CATEGORY.findOne({ name: 'Beef' }).then((category) => {
        if (!category) {
            CATEGORY.create({ name: 'Beef' });
        }
    });
};