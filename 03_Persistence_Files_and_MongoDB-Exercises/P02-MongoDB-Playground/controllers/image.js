const FORMIDABLE = require('formidable');
const DB = require('../config/database.config');

module.exports = (req, res) => {
    if (req.pathname === '/addImage' && req.method === 'POST') {
        const FORM = new FORMIDABLE.IncomingForm();
        let fields = {};

        FORM.on('field', (field, value) => {
            fields[field] = value;
        });

        FORM.on('end', () => {
            let tags = fields.tagsID.split(',').filter(onlyUnique);
            let image = {
                url: fields.imageUrl,
                title: fields.imageTitle,
                description: fields.description,
                tags
            };

            DB.mongo.addImage(image).then(() => {
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
    } else if (req.pathname === '/delete' && req.method === 'GET') {
        DB.mongo.deleteImage(req.query.id).then(() => {
            res.writeHead(302, {
                Location: '/'
            });
            res.end();
        }).catch((err) => {
            console.log(err);
            res.end();
        });
    } else {
        return true;
    }
};

function onlyUnique(value, index, self) {
    if (value === '') {
        return false;
    }

    return self.indexOf(value) === index;
}