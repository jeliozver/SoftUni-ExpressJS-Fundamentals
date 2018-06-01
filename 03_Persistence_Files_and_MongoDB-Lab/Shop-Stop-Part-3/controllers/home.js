const PATH = require('path');
const DB = require('../config/database.config');
const TEMPLATES = require('../config/generateContent');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    if (req.pathname === '/' && req.method === 'GET') {
        let filePath = PATH.normalize(PATH.join(__dirname, '../views/home/index.html'));

        if (req.query) {
            DB.mongo.getProductsByQuery(req.query).then((products) => {
                HANDLE_RESPONSE(res, filePath, 'html', TEMPLATES.generateProducts(products));
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        } else {
            DB.mongo.getAllProducts().then((products) => {
                HANDLE_RESPONSE(res, filePath, 'html', TEMPLATES.generateProducts(products));
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        }
    } else {
        return true;
    }
};