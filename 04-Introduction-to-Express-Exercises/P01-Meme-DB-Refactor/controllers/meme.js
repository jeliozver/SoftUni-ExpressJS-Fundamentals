const PATH = require('path');
const FS = require('fs');
const FORMIDABLE = require('formidable');
const SHORTID = require('shortid');
const DB = require('../config/database.config');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = {
    addMemeGet: (req, res) => {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/addMeme.html'));
        DB.getAllGenres().then((genres) => {
            let content = '';
            for (let genre of genres) {
                content += `<option value="${genre._id}">${genre.genreName}</option>`;
            }
            HANDLE_RESPONSE.handleResponse(res, htmlPath, content);
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
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/result.html'));
        let content = '';
        DB.getAllMemes().then((memes) => {
            for (let meme of memes) {
                content += `<div class="meme"><a href="/getDetails/${meme._id}">
                <img class="memePoster" src="${meme.memeSrc}"/></div>`;
            }

            HANDLE_RESPONSE.handleResponse(res, htmlPath, content);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    viewDetails: (req, res) => {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/details.html'));
        let id = req.params.id;

        DB.getMemeById(id).then((meme) => {
            let imgDetails = meme.memeSrc.split('/').filter(e => e !== '');

            let content = `<div class="content">
            <img src="${meme.memeSrc}" alt=""/>
            <h3>Name:  ${meme.memeName}</h3>
            <h2>Votes:  ${meme.votes}</h2>
            <p> ${meme.description}</p>
            <a id="download" href="/download/${imgDetails[1]}:${imgDetails[2]}">Download Meme</a>
            <a id="vote" href="/vote/${meme._id}">Vote for Meme</a>
            </div>`;

            HANDLE_RESPONSE.handleResponse(res, htmlPath, content);
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

    searchMemeGet: (rq, res) => {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/searchMeme.html'));
        DB.getAllGenres().then((genres) => {
            let content = '<option value="all">all</option>';
            for (let genre of genres) {
                content += `<option value="${genre._id}">${genre.genreName}</option>`;
            }
            HANDLE_RESPONSE.handleResponse(res, htmlPath, content);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    searchMemePost: (req, res) => {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/result.html'));
        let content = '';
        DB.searchMeme(req.body).then((memes) => {
            for (let meme of memes) {
                content += `<div class="meme"><a href="/getDetails/${meme._id}">
                <img class="memePoster" src="${meme.memeSrc}"/></div>`;
            }

            if (content === '') {
                content = 'Sorry, no memes met your criteria';
            }
            
            HANDLE_RESPONSE.handleResponse(res, htmlPath, content);
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
            res.redirect('/addMeme');
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    });

    FORM.parse(req);
}