const CATEGORY = require('../models/Category');
const PRODUCT = require('../models/Product');
const ROLE = require('../models/Role');
const FS = require('fs');

function editProduct(product, editedProduct) {
    if (product.category.toString() !== editedProduct.category) {
        return new Promise((resolve, reject) => {
            Promise.all([
                CATEGORY.update({ _id: product.category }, { $pull: { products: product._id } }),
                CATEGORY.update({ _id: editedProduct.category }, { $push: { products: product._id } })
            ]).then(() => {
                product.category = editedProduct.category;
                product.save();
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    return new Promise((resolve, reject) => {
        product.save();
        resolve();
    });
}

function isAdmin(user) {
    ROLE.findOne({ name: 'Admin' }).then((role) => {
        if (!role) {
            return false;
        }

        let isAdmin = user.roles.indexOf(role._id) !== -1;
        return isAdmin;
    });
}

module.exports = {
    addProductGet: (req, res) => {
        CATEGORY.find({}).then((categories) => {
            res.render('product/add', { categories: categories });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    addProductPost: (req, res) => {
        let productObj = req.body;
        productObj.image = `/images/${req.file.filename}`;
        productObj.creator = req.user._id;

        PRODUCT.create(productObj).then((insertedProduct) => {
            CATEGORY.findById(insertedProduct.category).then((category) => {
                category.products.push(insertedProduct._id);
                category.save();
                res.redirect('/');
            }).catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    editProductGet: (req, res) => {
        let id = req.params.id;

        PRODUCT.findById(id).then((product) => {
            if (!product) {
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not found!')}`
                );

                return;
            }

            if (product.buyer) {
                res.redirect(
                    `/?error=${encodeURIComponent('This product has a buyer!')}`
                );

                return;
            }

            if (product.creator.equals(req.user._id) || isAdmin(req.user)) {
                CATEGORY.find({}).then((categories) => {
                    res.render('product/edit', {
                        product: product,
                        categories: categories
                    });
                }).catch((err) => {
                    console.log(err);
                    res.sendStatus(400);
                });
            } else {
                res.redirect(
                    `/?error=${encodeURIComponent('You must be author or Admin to edit this product')}`
                );
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    editProductPost: (req, res) => {
        let id = req.params.id;
        let editedProduct = req.body;

        PRODUCT.findById(id).then((product) => {
            if (!product) {
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not found!')}`
                );

                return;
            }

            if (product.buyer) {
                res.redirect(
                    `/?error=${encodeURIComponent('This product has a buyer!')}`
                );

                return;
            }

            if (product.creator.equals(req.user._id) || isAdmin(req.user)) {
                product.name = editedProduct.name;
                product.description = editedProduct.description;
                product.price = editedProduct.price;

                if (req.file) {
                    let imageName = product.image.split('/').pop();
                    FS.unlink(`./content/images/${imageName}`, (err) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                            return;
                        }

                        product.image = `/images/${req.file.filename}`;

                        editProduct(product, editedProduct).then(() => {
                            res.redirect(
                                `/?success=${encodeURIComponent('Product was edited successfully!')}`
                            );
                        }).catch((err) => {
                            console.log(err);
                            res.redirect(
                                `/?error=${encodeURIComponent('Product was not edited!')}`
                            );
                        });
                    });
                } else {
                    editProduct(product, editedProduct).then(() => {
                        res.redirect(
                            `/?success=${encodeURIComponent('Product was edited successfully!')}`
                        );
                    }).catch((err) => {
                        console.log(err);
                        res.redirect(
                            `/?error=${encodeURIComponent('Product was not edited!')}`
                        );
                    });
                }
            } else {
                res.redirect(
                    `/?error=${encodeURIComponent('You must be author or Admin to edit this product')}`
                );
            }

        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    deleteProductGet: (req, res) => {
        let id = req.params.id;

        PRODUCT.findById(id).then((product) => {
            if (!product) {
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not found!')}`
                );
                return;
            }

            if (product.buyer) {
                res.redirect(
                    `/?error=${encodeURIComponent('This product has a buyer!')}`
                );

                return;
            }

            if (product.creator.equals(req.user._id) || isAdmin(req.user)) {
                res.render('product/delete', {
                    product: product
                });
            } else {
                res.redirect(
                    `/?error=${encodeURIComponent('You must be author or Admin to delete this product')}`
                );
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    deleteProductPost: (req, res) => {
        let id = req.params.id;

        PRODUCT.findById(id).then((product) => {
            if (product.creator.equals(req.user._id) || isAdmin(req.user)) {
                PRODUCT.findByIdAndRemove(id).then((removedProduct) => {
                    CATEGORY.update({ _id: removedProduct.category }, { $pull: { products: removedProduct._id } }).then(() => {
                        let imageName = removedProduct.image.split('/').pop();
                        FS.unlink(`./content/images/${imageName}`, (err) => {
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                                return;
                            }

                            res.redirect(
                                `/?success=${encodeURIComponent('Product was deleted successfully!')}`
                            );
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                    res.redirect(
                        `/?error=${encodeURIComponent('Product was not found!')}`
                    );
                });
            } else {
                res.redirect(
                    `/?error=${encodeURIComponent('You must be author or Admin to delete this product')}`
                );
            }
        });
    },

    buyProductGet: (req, res) => {
        let id = req.params.id;

        PRODUCT.findById(id).then((product) => {
            if (!product) {
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not found!')}`
                );

                return;
            }

            if (product.buyer) {
                res.redirect(
                    `/?error=${encodeURIComponent('This product has a buyer!')}`
                );

                return;
            }

            res.render('product/buy', {
                product: product
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    buyProductPost: (req, res) => {
        let id = req.params.id;

        PRODUCT.findById(id).then((product) => {
            if (product.buyer) {
                let error = `error=${encodeURIComponent('Product was already bought!')}`;
                res.redirect(`/?${error}`);
                return;
            }

            product.buyer = req.user._id;
            product.save().then(() => {
                req.user.boughtProducts.push(id);
                req.user.save().then(() => {
                    res.redirect('/');
                });
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    }
};