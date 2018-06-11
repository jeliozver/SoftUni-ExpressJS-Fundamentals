const DB = require('../config/database.config');

module.exports = {
    index: (req, res) => {
        DB.getAll().then((books) => {
            res.render('home/index', {'books' : `${books.length}`});
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }
};