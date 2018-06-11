const PATH = require('path');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = {
    index: (req, res) => {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/home.html'));
        HANDLE_RESPONSE.handleResponse(res, htmlPath, '');
    }
};