const HTTP = require('http');
const URL = require('url');
const FS = require('fs');
const PATH = require('path');
const QS = require('querystring');
const DB = require('../config/database');
const MULTIPARTY = require('multiparty');
const SHORTID = require('shortid');

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
        let form = new MULTIPARTY.Form();
        let product = {};

        form.on('part', (part) => {
            if (part.filename) {
                let dataString = '';
                let extension = part.filename.split('.')[1];

                part.setEncoding('binary');
                part.on('data', (data) => {
                    dataString += data;
                });

                part.on('end', () => {
                    let fileName = SHORTID.generate();
                    let filePath = `./content/images/${fileName}.${extension}`;

                    product.image = filePath;
                    FS.writeFile(filePath, dataString, { encoding: 'ascii' }, (err) => {
                        if (err) {
                            return;
                        }
                    });
                });
            } else {
                part.setEncoding('utf-8');
                let field = '';

                part.on('data', (data) => {
                    field += data;
                });

                part.on('end', () => {
                    product[part.name] = field;
                });
            }
        });

        form.on('close', () => {
            DB.products.add(product);

            res.writeHead(302, {
                Location: '/'
            });

            res.end();
        });

        form.parse(req);
    } else {
        return true;
    }
};