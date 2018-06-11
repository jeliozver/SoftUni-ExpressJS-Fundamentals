const DB = require('../config/database.config');

module.exports = {
    addBookGet: (req, res) => {
        res.render('book/addBook');
    },

    addBookPost: (req, res) => {
        let book = {
            bookTitle: req.body.bookTitle,
            bookAuthor: req.body.bookAuthor,
            bookYear: Number(req.body.bookYear),
            bookPoster: req.body.bookPoster
        };

        DB.addBook(book).then(() => {
            res.render('book/addBook', { success: 'success' });
        }).catch((err) => {
            console.log(err);
            res.render('book/addBook', { error: 'err' });
        });
    },

    viewAll: (req, res) => {
        DB.getAll().then((books) => {
            res.render('book/viewAll', { books: books });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    bookDetails: (req, res) => {
        DB.getBookById(req.params.id).then((book) => {
            res.render('book/details', { book: book });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }
};