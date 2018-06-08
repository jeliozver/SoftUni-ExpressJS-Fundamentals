const PATH = require('path');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    if (req.pathname === '/' && req.method === 'GET') {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/home.min.html'));
        HANDLE_RESPONSE(res, htmlPath, 'html', '');
    } else {
        return true;
    }
};