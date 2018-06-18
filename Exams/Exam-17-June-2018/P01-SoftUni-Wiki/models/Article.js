const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const DATE = MONGOOSE.Schema.Types.Date;
const BOOLEAN = MONGOOSE.Schema.Types.Boolean;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const ARTICLE_SCHEMA = MONGOOSE.Schema({
    title: { type: STRING, required: true },
    locked: { type: BOOLEAN, default: false },
    creationDate: { type: DATE, default: Date.now },
    edits: [{ type: OBJECT_ID, ref: 'Edit' }]
});

const ARTICLE = MONGOOSE.model('Article', ARTICLE_SCHEMA);

module.exports = ARTICLE;