const MONGOOSE = require('mongoose');
const BOOK = require('../models/Book');
MONGOOSE.Promise = global.Promise;

module.exports = {
    init: (config) => {
        return new Promise((resolve, reject) => {
            MONGOOSE.connect(config.connectionString);

            let db = MONGOOSE.connection;

            db.once('open', (err) => {
                if (err) {
                    reject(err);
                }

                console.log('MongoDB is ready!');
                resolve();
            });

            db.on('error', (err) => {
                reject(err);
            });
        });
    },

    addBook: (book) => {
        return new Promise((resolve, reject) => {
            BOOK.create(book).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    },

    getAll: () => {
        return new Promise((resolve, reject) => {
            BOOK.find({}).sort({ bookYear: -1 }).then((books) => {
                resolve(books);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    getBookById: (id) => {
        return new Promise((resolve, reject) => {
            BOOK.findById(id).then((book) => {
                resolve(book);
            }).catch((err) => {
                reject(err);
            });
        });
    }
};