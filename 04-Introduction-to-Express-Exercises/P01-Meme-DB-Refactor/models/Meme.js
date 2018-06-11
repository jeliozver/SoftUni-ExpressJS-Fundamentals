const MONGOOSE = require('mongoose');
const DATE = MONGOOSE.Schema.Types.Date;
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const MEME_SCHEMA = MONGOOSE.Schema({
    memeName: { type: STRING, required: true, unique: true },
    description: { type: STRING, required: true },
    memeSrc: { type: STRING },
    privacy: { type: STRING },
    dateStamp: { type: DATE, default: Date.now },
    votes: { type: NUMBER, default: 0 },
    genre: { type: OBJECT_ID, ref: 'Genre' }
});

let Meme = MONGOOSE.model('Meme', MEME_SCHEMA);

module.exports = Meme;