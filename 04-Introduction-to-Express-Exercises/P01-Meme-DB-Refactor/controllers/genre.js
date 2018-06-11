const PATH = require('path');
const HANDLE_RESPONSE = require('../config/handleResponse');
const DB = require('../config/database.config');

module.exports = {
    addGenreGet: (req, res) => {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/addGenre.html'));
        HANDLE_RESPONSE.handleResponse(res, htmlPath, '');
    },

    addGenrePost: (req, res) => {
        DB.addGenre(req.body.genreName).then(() => {
            res.redirect('/addGenre');
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }
};