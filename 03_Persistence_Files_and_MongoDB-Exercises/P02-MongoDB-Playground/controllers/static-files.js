const PATH = require('path');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    if (req.pathname.startsWith('/public/') && req.method === 'GET') {
        let filePath = PATH.normalize(PATH.join(__dirname, `..${req.pathname}`));
        HANDLE_RESPONSE(res, filePath, req.pathname, '');
    } else {
        return true;
    }
};