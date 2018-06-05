const DB = require('../config/database.config');

module.exports = {
    index: (req, res) => {
        if (req.query.query) {
            DB.mongo.getProductsByQuery(req.query).then((products) => {
                let data = { products: products };
                if (req.query.error) {
                    data.error = req.query.error;
                } else if (req.query.success) {
                    data.success = req.query.success;
                }
                res.render('home/index', data);
            }).catch(() => {
                res.sendStatus(404);
            });
        } else {
            DB.mongo.getAllProducts().then((products) => {
                let data = { products: products };
                if (req.query.error) {
                    data.error = req.query.error;
                } else if (req.query.success) {
                    data.success = req.query.success;
                }
                res.render('home/index', data);
            }).catch(() => {
                res.sendStatus(404);
            });
        }
    }
};