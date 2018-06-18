const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const DATE = MONGOOSE.Schema.Types.Date;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const EDIT_SCHEMA = MONGOOSE.Schema({
    author: { type: OBJECT_ID, ref: 'User' },
    creationDate: { type: DATE, default: Date.now },
    article: { type: OBJECT_ID, ref: 'Article' },
    content: { type: STRING, required: true }
});

const EDIT = MONGOOSE.model('Edit', EDIT_SCHEMA);

module.exports = EDIT;