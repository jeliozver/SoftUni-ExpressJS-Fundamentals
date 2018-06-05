const MONGOOSE = require('mongoose');
const PRODUCT = require('../models/Product');
const CATEGORY = require('../models/Category');
MONGOOSE.Promise = global.Promise;

module.exports.mongo = {};

module.exports.mongo.init = (config) => {
    return new Promise((resolve, reject) => {
        MONGOOSE.connect(config.connectionString);

        let db = MONGOOSE.connection;

        db.once('open', (err) => {
            if (err) {
                reject(err);
            }

            console.log('MongoDB is ready!');
            resolve();
        });

        db.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports.mongo.getAllProducts = () => {
    return new Promise((resolve, reject) => {
        PRODUCT.find({}).populate('category').then((products) => {
            resolve(products);
        }).catch(() => {
            reject();
        });
    });
};

module.exports.mongo.getProductsByQuery = (query) => {
    return new Promise((resolve, reject) => {
        PRODUCT.find({ 'name': { '$regex': `${query.query.toLowerCase()}`, '$options': 'i' } })
            .populate('category')
            .then((products) => {
                resolve(products);
            }).catch(() => {
                reject();
            });
    });
};

module.exports.mongo.getProductsByCategory = (categoryName) => {
    return new Promise((resolve, reject) => {
        CATEGORY.findOne({ name: categoryName }).populate('products').then((category) => {
            if (!category) {
                reject();
                return;
            }
            resolve(category);
        }).catch(() => {
            reject();
        });
    });
};

module.exports.mongo.getProductById = (id) => {
    return new Promise((resolve, reject) => {
        PRODUCT.findById(id).then((product) => {
            resolve(product);
        }).catch(() => {
            reject();
        });
    });
};

module.exports.mongo.addProduct = (product) => {
    return new Promise((resolve, reject) => {
        PRODUCT.create(product).then((insertedProduct) => {
            resolve(insertedProduct);
        }).catch(() => {
            reject();
        });
    });
};

module.exports.mongo.editProduct = (product, editedProduct) => {
    if (product.category.toString() !== editedProduct.category) {
        return new Promise((resolve, reject) => {
            Promise.all([
                CATEGORY.update({ _id: product.category }, { $pull: { products: product._id } }),
                CATEGORY.update({ _id: editedProduct.category }, { $push: { products: product._id } })
            ]).then(() => {
                product.category = editedProduct.category;
                product.save();
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    return new Promise((resolve) => {
        product.save();
        resolve();
    });
};

module.exports.mongo.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        PRODUCT.findByIdAndRemove(id).then((removedProduct) => {
            CATEGORY.update(
                { _id: removedProduct.category }, { $pull: { products: removedProduct._id } }
            ).then(() => {
                resolve(removedProduct.image);
            }).catch(() => {
                reject();
            });
        }).catch(() => {
            reject();
        });
    });
};

module.exports.mongo.addCategory = (category) => {
    return new Promise((resolve, reject) => {
        CATEGORY.create(category).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};

module.exports.mongo.getAllCategories = () => {
    return new Promise((resolve, reject) => {
        CATEGORY.find({}).then((categories) => {
            resolve(categories);
        }).catch(() => {
            reject();
        });
    });
};

module.exports.mongo.getCategoryById = (categoryId, productId) => {
    return new Promise((resolve, reject) => {
        CATEGORY.findById(categoryId).then((category) => {
            category.products.push(productId);
            category.save();
            resolve();
        }).catch(() => {
            reject();
        });
    });
};