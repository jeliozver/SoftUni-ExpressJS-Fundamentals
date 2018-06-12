const CATEGORY = require('mongoose').model('Category');
const PRODUCT = require('mongoose').model('Product');

module.exports = {
    createGet: (req, res) => {
        CATEGORY.find({}).then((categories) => {
            res.render('product/create', { categories });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    createPost: (req, res) => {
        let product = {
            category: req.body.category,
            size: Number(req.body.size),
            image: req.body.imageUrl,
            toppings: req.body.toppings.split(',')
        };

        PRODUCT.create(product).then((newProduct) => {
            CATEGORY.update({ _id: newProduct.category }, { $push: { products: newProduct._id } }).then(() => {
                req.session.msg = { success: 'Product created!' };
                res.redirect('/');
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }
};