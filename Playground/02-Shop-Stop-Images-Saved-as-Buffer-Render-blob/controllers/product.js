const PATH = require('path');
const FORMIDABLE = require('formidable');
const PRODUCT = require('../models/Product');
const HANDLE_RESPONSE = require('../config/handleResponse');
const FS = require('fs');

module.exports = (req, res) => {
    if (req.pathname === '/product/add' && req.method === 'GET') {
        let filePath = PATH
            .normalize(PATH.join(__dirname, '../views/products/add.html'));
        HANDLE_RESPONSE(res, filePath, 'html', '');
    } else if (req.pathname === '/product/add' && req.method === 'POST') {
        const FORM = new FORMIDABLE.IncomingForm();
        let files = [];
        let fields = {};

        FORM.onPart = function (part) {
            if (part.filename) {
                fields['mime'] = part.mime;
            }

            part.addListener('data', function (data) {
                if (part.filename) {
                    files.push(data);
                } else {
                    fields[part.name] = data.toString();
                }
            });
        };

        FORM.on('end', () => {
            fields['image'] = Buffer.concat(files);

            PRODUCT.create(fields).then(() => {
                res.writeHead(302, {
                    Location: '/'
                });

                res.end();
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        });

        FORM.parse(req);
    } else if (req.pathname === '/products' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        PRODUCT.find({}).lean().then((products) => {
            res.write(JSON.stringify(products));
            res.end();
        }).catch((err) => {
            console.log(err);
            res.end();
        });
    } else {
        return true;
    }
};