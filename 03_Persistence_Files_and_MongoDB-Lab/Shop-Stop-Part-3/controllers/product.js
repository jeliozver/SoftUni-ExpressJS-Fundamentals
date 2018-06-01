const PATH = require('path');
const FORMIDABLE = require('formidable');
const SHORTID = require('shortid');
const DB = require('../config/database.config');
const TEMPLATES = require('../config/generateContent');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    if (req.pathname === '/product/add' && req.method === 'GET') {
        let filePath = PATH.normalize(PATH.join(__dirname, '../views/products/add.html'));

        DB.mongo.getAllCategories().then((categories) => {
            HANDLE_RESPONSE(res, filePath, 'html', TEMPLATES.generateCategories(categories));
        }).catch((err) => {
            console.log(err);
            res.end();
        });
    } else if (req.pathname === '/product/add' && req.method === 'POST') {
        const FORM = new FORMIDABLE.IncomingForm();
        let files = [];
        let fields = {};

        let filePath = '/content/images/';
        FORM.uploadDir = PATH.normalize(PATH.join(__dirname, `..${filePath}`));
        FORM.keepExtensions = true;

        FORM.on('field', (field, value) => {
            fields[field] = value;
        });

        FORM.on('fileBegin', (name, file) => {
            let fileName = `${SHORTID.generate()}.${file.name.split('.')[1]}`;
            fields['image'] = `${filePath}${fileName}`;
            file.path = `${FORM.uploadDir}/${fileName}`;
        });

        FORM.on('file', (field, file) => {
            files.push([field, file]);
        });

        FORM.on('end', () => {
            DB.mongo.addProduct(fields).then((insertedProduct) => {
                DB.mongo.getCategotyById(fields.category, insertedProduct._id).then(() => {
                    res.writeHead(302, {
                        Location: '/'
                    });

                    res.end();
                }).catch((err) => {
                    console.log(err);
                    res.end();
                });
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        });

        FORM.parse(req);
    } else {
        return true;
    }
};