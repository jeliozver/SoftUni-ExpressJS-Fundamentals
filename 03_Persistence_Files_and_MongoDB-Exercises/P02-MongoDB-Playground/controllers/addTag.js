const QS = require('querystring');
const DB = require('../config/database.config');

module.exports = (req, res) => {
    if (req.pathname === '/generateTag' && req.method === 'POST') {
        let queryData = '';

        req.on('data', (data) => {
            queryData += data;
        });

        req.on('end', () => {
            let tagName = QS.parse(queryData).tagName;

            DB.mongo.addTag(tagName).then(() => {
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