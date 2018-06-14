const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const CLASS_SCHEMA = MONGOOSE.Schema({
    name: { type: STRING, required: true, unique: true },
    cars: [{ type: OBJECT_ID, ref: 'Car' }]
});

const CLASS = MONGOOSE.model('Class', CLASS_SCHEMA);

module.exports = CLASS;

module.exports.init = () => {
    CLASS.findOne({ name: 'Economy' }).then((newClass) => {
        if (!newClass) {
            CLASS.create({ name: 'Economy' });
        }
    });

    CLASS.findOne({ name: 'Standard' }).then((newClass) => {
        if (!newClass) {
            CLASS.create({ name: 'Standard' });
        }
    });

    CLASS.findOne({ name: 'Luxury' }).then((newClass) => {
        if (!newClass) {
            CLASS.create({ name: 'Luxury' });
        }
    });
};