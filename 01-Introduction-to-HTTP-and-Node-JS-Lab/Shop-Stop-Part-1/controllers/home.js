const HTTP = require('http');
const URL = require('url');
const FS = require('fs');
const PATH = require('path');
const QS = require('querystring');
const DB = require('../config/database');

/**
 * 
 * @param {HTTP.ClientRequest} req 
 * @param {HTTP.ClientResponse} res 
 */
module.exports = (req, res) => {
    req.pathname = req.pathname || URL.parse(req.url).pathname;

    if (req.pathname === '/' && req.method === 'GET') {
        let filePath = PATH.normalize(PATH.join(__dirname, '../views/home/index.html'));

        const READ = FS.createReadStream(filePath);
        
        READ.on('data', (data) => {
            if (data.toString().indexOf('{content}') !== -1) {

                let queryData = QS.parse(URL.parse(req.url).query);
                let products;
                let content = '';

                if (queryData.query) {
                    products = DB.products.filterByQuery(queryData.query);
                } else {
                    products = DB.products.getAll();
                }

                for (let product of products) {
                    content +=
                        `<div class="product-card">
                        <img class="product-img" src="${product.image}">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                    </div>`;
                }

                data = data.toString().replace('{content}', content);
            }

            res.write(data);
        });

        READ.on('end', () => {
            res.end();
        });

        READ.on('error', (err) => {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            res.write('404 not found!');
            res.end();
        });
    } else {
        return true;
    }
};