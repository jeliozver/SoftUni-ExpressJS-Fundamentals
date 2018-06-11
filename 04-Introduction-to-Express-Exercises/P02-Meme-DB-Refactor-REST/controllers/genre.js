const DB = require('../config/database.config');

module.exports = {
    create: (req, res) => {
        DB.addGenre(req.body).then((genre) => {
            res.json(JSON.stringify(genre));
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    getAll: (req, res) => {
        DB.getAllGenres().then((genres) => {
            res.json(JSON.stringify(genres));
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    getSingle: (req, res) => {
        DB.getGenreById(req.params.id).then((genre) => {
            res.json(JSON.stringify(genre));
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    update: (req, res) => {
        DB.updateGenre(req.params.id, req.body).then((updatedGenre) => {
            res.json(JSON.stringify(updatedGenre));
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    delete: (req, res) => {
        DB.deleteGenre(req.params.id).then((deletedGenre) => {
            res.json(JSON.stringify(deletedGenre));
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }
};