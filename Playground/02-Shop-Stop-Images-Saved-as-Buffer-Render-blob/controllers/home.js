const PATH = require('path');
const PRODUCT = require('../models/Product');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    if (req.pathname === '/' && req.method === 'GET') {
        let filePath = PATH.normalize(PATH.join(__dirname, '../views/home/index.html'));
        let products = [];
        let content = '';

        if (req.query) {
            //products = DB.products.filterByQuery(req.query);
        } else {
            // products = DB.products.getAll();
        }

        for (let product of products) {
            content +=
                `<div class="product-card">
                        <img class="product-img" src="${product.image}">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                    </div>`;
        }

        HANDLE_RESPONSE(res, filePath, 'html', content);
    } else {
        return true;
    }
};