const PATH = require('path');
const FS = require('fs');
const FORMIDABLE = require('formidable');
const SHORTID = require('shortid');
const HANDLE_RESPONSE = require('../config/handleResponse');
const DB = require('../config/database');

module.exports = (req, res) => {
    if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
        let filePath = PATH.normalize(PATH.join(__dirname, '../views/viewAll.min.html'));
        let content = '';
        let memes = DB.memes.getPublic();

        for (let meme of memes) {
            content += `<div class="meme"><a href="/getDetails/${meme.id}">
            <img class="memePoster" src="${meme.memeSrc}"/></div>`;
        }

        HANDLE_RESPONSE(res, filePath, 'html', content);
    } else if (req.pathname === '/addMeme' && req.method === 'GET') {
        let filePath = PATH.normalize(PATH.join(__dirname, '../views/addMeme.min.html'));
        HANDLE_RESPONSE(res, filePath, 'html', '');
    } else if (req.pathname === '/addMeme' && req.method === 'POST') {
        let uploadDir = '/public/memeStorage';
        let filePath = PATH.normalize(PATH.join(__dirname, `..${uploadDir}`));
        let currentIndex = '';

        FS.readdir(filePath, (err, folders) => {
            if (err) {
                console.log(err);
                return;
            }
            currentIndex = folders.length;
            FS.readdir(`${filePath}/${currentIndex}`, (err, files) => {
                if (err) {
                    console.log(err);
                    return;
                }

                if (files.length >= 1000) {
                    currentIndex++;
                    FS.mkdir(`${filePath}/${currentIndex}`, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        uploadDir += `/${currentIndex}`;
                        handleForm(uploadDir, req, res);
                    });
                } else {
                    uploadDir += `/${currentIndex}`;
                    handleForm(uploadDir, req, res);
                }
            });
        });
    } else if (req.pathname.startsWith('/getDetails/') && req.method === 'GET') {
        let filePath = PATH.normalize(PATH.join(__dirname, '../views/details.min.html'));
        let id = req.pathname.split('/')[2];
        let targetedMeme = DB.memes.getSingle(id);
        let content = `<div class="content">
        <img src="${targetedMeme.memeSrc}" alt=""/>
        <h3>Title  ${targetedMeme.title}</h3>
        <p> ${targetedMeme.description}</p>
        <a id="download" href="${targetedMeme.memeSrc}">Download Meme</a>
        </div>`;

        HANDLE_RESPONSE(res, filePath, 'html', content);
    } else {
        return true;
    }
};

function handleForm(uploadDir, req, res) {
    const FORM = new FORMIDABLE.IncomingForm();
    let files = [];
    let fields = {};

    fields['id'] = SHORTID.generate();
    fields['dateStamp'] = Date.now();

    let filePath = uploadDir;
    FORM.uploadDir = PATH.normalize(PATH.join(__dirname, `..${uploadDir}`));
    FORM.keepExtensions = true;

    FORM.on('field', (field, value) => {
        fields[field] = value;
    });

    FORM.on('fileBegin', (name, file) => {
        let fileName = `${SHORTID.generate()}.${file.name.split('.')[1]}`;
        fields['memeSrc'] = `${filePath}/${fileName}`;
        file.path = `${FORM.uploadDir}/${fileName}`;
    });

    FORM.on('file', (field, file) => {
        files.push([field, file]);
    });

    FORM.on('end', () => {
        DB.memes.add(fields);
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/addMeme.min.html'));
        let content = '<div id="succssesBox"><h2 id="succssesMsg">Meme Added</h2></div>';
        HANDLE_RESPONSE(res, htmlPath, 'html', content);
    });

    FORM.parse(req);
}