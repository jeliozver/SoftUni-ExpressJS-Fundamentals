const DB = require('../config/database.config');

module.exports = {
    addGenreGet: (req, res) => {
        res.render('genre/addGenre');
    },

    addGenrePost: (req, res) => {
        DB.addGenre(req.body.genreName).then(() => {
            res.render('home/index', {success: `Genre ${req.body.genreName} added!`});
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }
};