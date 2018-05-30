const URL = require('url');
const PATH = require('path');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    req.pathname = req.pathname || URL.parse(req.url).pathname;

    if (req.pathname.startsWith('/public/') && req.method === 'GET') {
        let path = PATH.normalize(PATH.join(__dirname, `..${req.pathname}`));
        HANDLE_RESPONSE(res, path, req.pathname, '');
    } else {
        return true;
    }
};