const HOME_CONTROLLER = require('../controllers/home');
const BOOK_CONTROLLER = require('../controllers/book');

module.exports = (APP) => {
    APP.get('/', HOME_CONTROLLER.index);

    APP.get('/addBook', BOOK_CONTROLLER.addBookGet);
    APP.post('/addBook', BOOK_CONTROLLER.addBookPost);
    APP.get('/viewAllBooks', BOOK_CONTROLLER.viewAll);
    APP.get('/books/details/:id', BOOK_CONTROLLER.bookDetails);
};