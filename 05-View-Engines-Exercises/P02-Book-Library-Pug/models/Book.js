const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;

const BOOK_SCHEMA = MONGOOSE.Schema({
    bookTitle: { type: STRING, required: true },
    bookAuthor: { type: STRING },
    bookYear: { type: NUMBER },
    bookPoster: { type: STRING, requred: true }
});

let Book = MONGOOSE.model('Book', BOOK_SCHEMA);

module.exports = Book;