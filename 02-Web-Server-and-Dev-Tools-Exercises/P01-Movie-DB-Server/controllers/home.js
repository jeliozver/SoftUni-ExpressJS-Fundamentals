const URL = require('url');
const PATH = require('path');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    req.pathname = req.pathname || URL.parse(req.url).pathname;

    if (req.pathname === '/' && req.method === 'GET') {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/home.min.html'));

        HANDLE_RESPONSE(res, htmlPath, 'html', '');
    } else {
        return true;
    }
};