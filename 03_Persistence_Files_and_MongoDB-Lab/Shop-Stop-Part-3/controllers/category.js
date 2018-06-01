const QS = require('querystring');
const PATH = require('path');
const DB = require('../config/database.config');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    if (req.pathname === '/category/add' && req.method === 'GET') {
        let filePath = PATH.normalize(PATH.join(__dirname, '../views/category/add.html'));
        HANDLE_RESPONSE(res, filePath, 'html', '');
    } else if (req.pathname === '/category/add' && req.method === 'POST') {
        let queryData = '';
        req.on('data', (data) => {
            queryData += data;
        });

        req.on('end', () => {
            let category = QS.parse(queryData);

            DB.mongo.addCategory(category).then(() => {
                res.writeHead(302, {
                    Location: '/'
                });

                res.end();
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        });
    } else {
        return true;
    }
};