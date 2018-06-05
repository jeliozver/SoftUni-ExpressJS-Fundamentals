const FS = require('fs');
const DB = require('../config/database.config');

module.exports = {
    addProductGet: (req, res) => {
        DB.mongo.getAllCategories().then((categories) => {
            res.render('product/add', { categories: categories });
        }).catch(() => {
            res.sendStatus(404);
        });
    },

    addProductPost: (req, res) => {
        let productObj = req.body;
        productObj.image = `/images/${req.file.filename}`;

        DB.mongo.addProduct(productObj).then((insertedProduct) => {
            DB.mongo.getCategoryById(productObj.category, insertedProduct._id).then(() => {
                res.redirect('/');
            }).catch(() => {
                res.sendStatus(404);
            });
        }).catch(() => {
            res.sendStatus(404);
        });
    },

    editProductGet: (req, res) => {
        let id = req.params.id;

        DB.mongo.getProductById(id).then((product) => {
            if (!product) {
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not found!')}`
                );
                return;
            }

            DB.mongo.getAllCategories().then((categories) => {
                res.render('product/edit', {
                    product: product,
                    categories: categories
                });
            }).catch(() => {
                res.sendStatus(404);
            });
        }).catch(() => {
            res.sendStatus(404);
        });
    },

    editProductPost: (req, res) => {
        let id = req.params.id;
        let editedProduct = req.body;

        DB.mongo.getProductById(id).then((product) => {
            if (!product) {
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not found!')}`
                );
                return;
            }

            product.name = editedProduct.name;
            product.description = editedProduct.description;
            product.price = editedProduct.price;

            if (req.file) {
                let imageName = product.image.split('/').pop();
                FS.unlink(`./content/images/${imageName}`, (err) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(404);
                        return;
                    }

                    product.image = `/images/${req.file.filename}`;
                    DB.mongo.editProduct(product, editedProduct).then(() => {
                        res.redirect(
                            `/?success=${encodeURIComponent('Product was edited successfully!')}`
                        );
                    }).catch(() => {
                        res.redirect(
                            `/?error=${encodeURIComponent('Product was not edited!')}`
                        );
                    });
                });
            } else {
                DB.mongo.editProduct(product, editedProduct).then(() => {
                    res.redirect(
                        `/?success=${encodeURIComponent('Product was edited successfully!')}`
                    );
                }).catch(() => {
                    res.redirect(
                        `/?error=${encodeURIComponent('Product was not edited!')}`
                    );
                });
            }
        }).catch(() => {
            res.sendStatus(404);
        });
    },

    deleteProductGet: (req, res) => {
        let id = req.params.id;

        DB.mongo.getProductById(id).then((product) => {
            if (!product) {
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not found!')}`
                );
                return;
            }

            res.render('product/delete', {
                product: product
            });

        }).catch(() => {
            res.sendStatus(404);
        });
    },

    deleteProductPost: (req, res) => {
        let id = req.params.id;

        DB.mongo.deleteProduct(id).then((imageSrc) => {
            let imageName = imageSrc.split('/').pop();
            FS.unlink(`./content/images/${imageName}`, (err) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(404);
                    return;
                }

                res.redirect(
                    `/?success=${encodeURIComponent('Product was deleted successfully!')}`
                );
            });
        }).catch(() => {
            res.redirect(
                `/?error=${encodeURIComponent('Product was not found!')}`
            );
        });
    },

    buyProductGet: (req, res) => {
        let id = req.params.id;

        DB.mongo.getProductById(id).then((product) => {
            if (!product) {
                res.redirect(
                    `/?error=${encodeURIComponent('Product was not found!')}`
                );

                return;
            }

            res.render('product/buy', {
                product: product
            });

        }).catch(() => {
            res.sendStatus(404);
        });
    }
};