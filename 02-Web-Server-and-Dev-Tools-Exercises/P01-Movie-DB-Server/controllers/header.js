const PATH = require('path');
const DB = require('../config/database');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    if (req.headers.statusheader === 'Full') {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/status.min.html'));
        let moviesCount = DB.movies.getCount();
        let content = `<h1>We currently have ${moviesCount} movies in our Database!</h1>`;

        HANDLE_RESPONSE(res, htmlPath, 'html', content);
    } else {
        return true;
    }
};