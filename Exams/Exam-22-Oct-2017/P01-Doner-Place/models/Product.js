const MONGOOSE = require('mongoose');
const CATEGORY = MONGOOSE.model('Category');
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const PRODUCT_SCHEMA = MONGOOSE.Schema({
    category: { type: OBJECT_ID, ref: 'Category', required: true },
    size: { type: NUMBER, required: true, min: 17, max: 24 },
    image: { type: STRING, requred: true },
    toppings: [{ type: STRING }]
});

const PRODUCT = MONGOOSE.model('Product', PRODUCT_SCHEMA);

module.exports = PRODUCT;

module.exports.init = () => {
    CATEGORY.findOne({ name: 'Chicken' }).then((category) => {
        if (!category) {
            CATEGORY.create({ name: 'Chicken' }).then((newCat) => {
                Promise.all([
                    PRODUCT.create({
                        category: newCat._id,
                        size: 17,
                        image: '/img/chicken-17.png',
                        toppings: ['Pickles', 'Tomatoe', 'Onion', 'Hot sauce']
                    }),

                    PRODUCT.create({
                        category: newCat._id,
                        size: 21,
                        image: '/img/chicken-21.png',
                        toppings: ['Pickles', 'Tomatoe', 'Lettuce', 'Hot sauce']
                    }),
    
                    PRODUCT.create({
                        category: newCat._id,
                        size: 24,
                        image: '/img/chicken-24.png',
                        toppings: ['Pickles', 'Tomatoe', 'Onion', 'Extra sauce']
                    })
                ]).then((products) => {
                    let ids = [];

                    for (let pr of products) {
                        ids.push(pr._id);
                    }

                    newCat.products = ids;
                    newCat.save();
                });
            });
        }
    });

    CATEGORY.findOne({ name: 'Lamb' }).then((category) => {
        if (!category) {
            CATEGORY.create({ name: 'Lamb' }).then((newCat) => {
                Promise.all([
                    PRODUCT.create({
                        category: newCat._id,
                        size: 17,
                        image: '/img/lamb-17.png',
                        toppings: ['Pickles', 'Tomatoe', 'Onion', 'Hot sauce']
                    }),

                    PRODUCT.create({
                        category: newCat._id,
                        size: 21,
                        image: '/img/lamb-21.png',
                        toppings: ['Pickles', 'Tomatoe', 'Lettuce', 'Hot sauce']
                    }),
    
                    PRODUCT.create({
                        category: newCat._id,
                        size: 24,
                        image: '/img/lamb-24.png',
                        toppings: ['Pickles', 'Tomatoe', 'Onion', 'Extra sauce']
                    })
                ]).then((products) => {
                    let ids = [];

                    for (let pr of products) {
                        ids.push(pr._id);
                    }

                    newCat.products = ids;
                    newCat.save();
                });
            });
        }
    });

    CATEGORY.findOne({ name: 'Beef' }).then((category) => {
        if (!category) {
            CATEGORY.create({ name: 'Beef' }).then((newCat) => {
                Promise.all([
                    PRODUCT.create({
                        category: newCat._id,
                        size: 17,
                        image: '/img/beef-17.png',
                        toppings: ['Pickles', 'Tomatoe', 'Onion', 'Hot sauce']
                    }),

                    PRODUCT.create({
                        category: newCat._id,
                        size: 21,
                        image: '/img/beef-21.png',
                        toppings: ['Pickles', 'Tomatoe', 'Lettuce', 'Hot sauce']
                    }),
    
                    PRODUCT.create({
                        category: newCat._id,
                        size: 24,
                        image: '/img/beef-24.png',
                        toppings: ['Pickles', 'Tomatoe', 'Onion', 'Extra sauce']
                    })
                ]).then((products) => {
                    let ids = [];

                    for (let pr of products) {
                        ids.push(pr._id);
                    }
                    
                    newCat.products = ids;
                    newCat.save();
                });
            });
        }
    });
};