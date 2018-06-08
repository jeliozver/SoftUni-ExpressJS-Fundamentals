const PATH = require('path');
const DB = require('../config/database.config');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    if (req.pathname === '/' && req.method === 'GET') {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/index.html'));

        DB.mongo.getAllTags().then((tags) => {
            let content = '';
            for (let tag of tags) {
                content += `<div class="tag" id="${tag._id}">${tag.name}</div>`;
            }
            HANDLE_RESPONSE(res, htmlPath, 'html', content);
        }).catch((err) => {
            console.log(err);
            res.end();
        });
    } else {
        return true;
    }
};