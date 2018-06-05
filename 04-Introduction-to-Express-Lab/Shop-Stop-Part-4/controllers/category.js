const DB = require('../config/database.config');

module.exports = {
    addCategoryGet: (req, res) => {
        res.render('category/add');
    },

    addCategoryPost: (req, res) => {
        let category = req.body;
        DB.mongo.addCategory(category).then(() => {
            res.redirect('/');
        }).catch(() => {
            res.sendStatus(404);
        });
    },

    productsByCategory: (req, res) => {
        let categoryName = req.params.category;
        DB.mongo.getProductsByCategory(categoryName).then((category) => {
            res.render('category/products', { category: category });
        }).catch(() => {
            res.sendStatus(404);
        });
    }
};