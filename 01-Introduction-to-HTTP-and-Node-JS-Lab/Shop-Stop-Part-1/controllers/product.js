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

    if (req.pathname === '/product/add' && req.method === 'GET') {
        let filePath = PATH
            .normalize(PATH.join(__dirname, '../views/products/add.html'));

        const READ = FS.createReadStream(filePath);

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
                
        READ.on('open', () => {
            READ.pipe(res);
        });
        
        READ.on('error', (err) => {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            res.write('404 not found!');
            res.end();
        });

    } else if (req.pathname === '/product/add' && req.method === 'POST') {
        let dataString = '';

        req.on('data', (data) => {
            dataString += data;
        });

        req.on('end', () => {
            let product = QS.parse(dataString);
            DB.products.add(product);

            res.writeHead(302, {
                Location: '/'
            });

            res.end();
        });
    } else {
        return true;
    }
};