const FS = require('fs');
const PATH = require('path');
const DB_PATH = PATH.join(__dirname, '/db.json');

function getMemes() {
    if (FS.existsSync(DB_PATH) === false) {
        FS.writeFileSync(DB_PATH, '[]');
        return [];
    }

    let json = FS.readFileSync(DB_PATH).toString() || '[]';
    return JSON.parse(json);
}

function saveMemes(memes) {
    let json = JSON.stringify(memes);
    FS.writeFileSync(DB_PATH, json);
}

module.exports.memes = {};

module.exports.memes.getAll = getMemes;

module.exports.memes.getPublic = () => {
    return getMemes()
        .filter(m => m.privacy === 'on')
        .sort((a, b) => b.dateStamp - a.dateStamp);
};

module.exports.memes.getSingle = (id) => {
    let json = FS.readFileSync(DB_PATH).toString();
    let memes = JSON.parse(json);
    let result = {};

    for (let meme of memes) {
        if (meme.id === id) {
            result = meme;
            break;
        }
    }

    return result;
};

module.exports.memes.add = (meme) => {
    let memes = getMemes();
    memes.push(meme);
    saveMemes(memes);
};