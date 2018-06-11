const DB = require('../config/database.config');

module.exports = {
    create: (req, res) => {
        DB.addMeme(req.body).then((meme) => {
            res.json(JSON.stringify(meme));
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    get: (req, res) => {
        DB.getMemes(req.query).then((memes) => {
            res.json(JSON.stringify(memes));
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    getSingle: (req, res) => {
        DB.getMemeById(req.params.id).then((meme) => {
            res.json(JSON.stringify(meme));
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    update: (req, res) => {
        DB.updateMeme(req.params.id, req.body).then((updatedMeme) => {
            res.json(JSON.stringify(updatedMeme));
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    delete: (req, res) => {
        DB.deleteMeme(req.params.id).then((deletedMeme) => {
            res.json(JSON.stringify(deletedMeme));
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }
};