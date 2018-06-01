const MONGOOSE = require('mongoose');
const PRODUCT = require('../models/Product');
const CATEGORY = require('../models/Category');
MONGOOSE.Promise = global.Promise;

module.exports.mongo = {};

module.exports.mongo.config = (config) => {
    MONGOOSE.connect(config.connectionString);

    let db = MONGOOSE.connection;

    db.once('open', (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('MongoDB is ready!');
    });
};

module.exports.mongo.getAllProducts = () => {
    return new Promise((resolve, reject) => {
        PRODUCT.find({}).then((products) => {
            resolve(products);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.mongo.getProductsByQuery = (query) => {
    return new Promise((resolve, reject) => {
        PRODUCT.find({ 'name': { '$regex': `${query.toLowerCase()}`, '$options': 'i' } },
            function (err, products) {
                if (err) {
                    reject(err);
                }
                resolve(products);
            });
    });
};

module.exports.mongo.addProduct = (product) => {
    return new Promise((resolve, reject) => {
        PRODUCT.create(product).then((insertedProduct) => {
            resolve(insertedProduct);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.mongo.addCategory = (category) => {
    return new Promise((resolve, reject) => {
        CATEGORY.create(category).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.mongo.getAllCategories = () => {
    return new Promise((resolve, reject) => {
        CATEGORY.find({}).then((categories) => {
            resolve(categories);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.mongo.getCategotyById = (categoryId, productId) => {
    return new Promise((resolve, reject) => {
        CATEGORY.findById(categoryId).then((category) => {
            category.products.push(productId);
            category.save();
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};