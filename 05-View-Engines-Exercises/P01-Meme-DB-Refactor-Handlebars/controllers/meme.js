const PATH = require('path');
const FS = require('fs');
const FORMIDABLE = require('formidable');
const SHORTID = require('shortid');
const DB = require('../config/database.config');

module.exports = {
    addMemeGet: (req, res) => {
        DB.getAllGenres().then((genres) => {
            res.render('meme/addMeme', { genres: genres });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    addMemePost: (req, res) => {
        let uploadDir = '/public/memeStorage';
        let filePath = PATH.normalize(PATH.join(__dirname, `..${uploadDir}`));
        let currentIndex = '';

        FS.readdir(filePath, (err, folders) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            currentIndex = folders.length;

            FS.readdir(`${filePath}/${currentIndex}`, (err, files) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }

                if (files.length >= 1000) {
                    currentIndex++;
                    FS.mkdir(`${filePath}/${currentIndex}`, (err) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                            return;
                        }
                        uploadDir += `/${currentIndex}`;
                        handleData(currentIndex, uploadDir, req, res);
                    });
                } else {
                    uploadDir += `/${currentIndex}`;
                    handleData(currentIndex, uploadDir, req, res);
                }
            });
        });
    },

    viewAll: (req, res) => {
        DB.getAllMemes().then((memes) => {
            if (memes) {
                res.render('meme/result', { memes: memes });
            } else {
                res.render('meme/result');
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    viewDetails: (req, res) => {
        let id = req.params.id;

        DB.getMemeById(id).then((meme) => {
            let imgDetails = meme.memeSrc.split('/').filter(e => e !== '');
            meme['imgDetails'] = `/download/${imgDetails[1]}:${imgDetails[2]}`;
            res.render('meme/details', { meme: meme });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    downloadMeme: (req, res) => {
        let tokens = req.params.path.split(':');
        let filePath = PATH.normalize(
            PATH.join(__dirname, `../public/memeStorage/${tokens[0]}/${tokens[1]}`)
        );
        res.download(filePath);
    },

    voteMeme: (req, res) => {
        let id = req.params.id;
        DB.voteForMeme(id).then(() => {
            res.redirect(`/getDetails/${id}`);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    searchMemeGet: (req, res) => {
        DB.getAllGenres().then((genres) => {
            res.render('meme/searchMeme', { genres: genres });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    searchMemePost: (req, res) => {
        DB.searchMeme(req.body).then((memes) => {
            if (memes) {
                res.render('meme/result', { memes: memes });
            } else {
                res.render('meme/result');
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }
};

function handleData(currentIndex, uploadDir, req, res) {
    const FORM = new FORMIDABLE.IncomingForm();
    let files = [];
    let fields = {};

    FORM.uploadDir = PATH.normalize(PATH.join(__dirname, `..${uploadDir}`));
    FORM.keepExtensions = true;

    FORM.on('field', (field, value) => {
        fields[field] = value;
    });

    FORM.on('fileBegin', (name, file) => {
        let fileName = `${SHORTID.generate()}.${file.name.split('.').pop()}`;
        fields['memeSrc'] = `/memeStorage/${currentIndex}/${fileName}`;
        file.path = `${FORM.uploadDir}/${fileName}`;
    });

    FORM.on('file', (field, file) => {
        files.push([field, file]);
    });

    FORM.on('end', () => {
        DB.addMeme(fields.genre, fields).then(() => {
            res.render('home/index', { success: `Meme ${fields.memeName} added!` });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    });

    FORM.parse(req);
}