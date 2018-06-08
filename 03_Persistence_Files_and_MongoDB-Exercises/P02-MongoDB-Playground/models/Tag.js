const MONGOOSE = require('mongoose');
const DATE = MONGOOSE.Schema.Types.Date;
const STRING = MONGOOSE.Schema.Types.String;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const TAG_SCHEMA = MONGOOSE.Schema({
    name: { type: STRING, required: true, lowercase: true },
    creationDate: { type: DATE, default: Date.now },
    images: [{ type: OBJECT_ID, ref: 'Image' }]
});

let Tag = MONGOOSE.model('Tag', TAG_SCHEMA);

module.exports = Tag;