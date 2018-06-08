const MONGOOSE = require('mongoose');
const DATE = MONGOOSE.Schema.Types.Date;
const STRING = MONGOOSE.Schema.Types.String;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const IMAGE_SCHEMA = MONGOOSE.Schema({
    url: { type: STRING, required: true },
    title: { type: STRING, required: true },
    description: { type: STRING },
    creationDate: { type: DATE, default: Date.now },
    tags: [{ type: OBJECT_ID, ref: 'Tag' }]
});

let Image = MONGOOSE.model('Image', IMAGE_SCHEMA);

module.exports = Image;