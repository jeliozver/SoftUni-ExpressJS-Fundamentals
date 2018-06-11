const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const GENRE_SCHEMA = MONGOOSE.Schema({
    genreName: { type: STRING, required: true, unique: true, lowercase: true },
    memes: [{ type: OBJECT_ID, ref: 'Meme' }]
});

let Genre = MONGOOSE.model('Genre', GENRE_SCHEMA);

module.exports = Genre;