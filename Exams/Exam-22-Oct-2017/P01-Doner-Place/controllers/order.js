const ORDER = require('mongoose').model('Order');
const PRODUCT = require('mongoose').model('Product');
const USER = require('mongoose').model('User');

module.exports = {
    orderGet: (req, res) => {
        let id = req.params.id;

        PRODUCT.findById(id).populate('category').then((product) => {
            res.render('order/customize', { product });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    orderPost: (req, res) => {
        let id = req.body.productId;
        let toppings = [];
        delete req.body.productId;

        for (let topping in req.body) {
            if (req.body.hasOwnProperty(topping)) {
                toppings.push(req.body[topping]);
            }
        }

        let order = {
            creator: req.user._id,
            product: id,
            toppings: toppings
        };

        ORDER.create(order).then((newOrder) => {
            USER.update({ _id: req.user.id }, { $push: { orders: newOrder._id } }).then(() => {
                res.redirect(`/order/details/${newOrder.id}`);
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    orderDetails: (req, res) => {
        let id = req.params.id;

        ORDER.findById(id)
            .populate({ path: 'product', populate: { path: 'category' } })
            .then((order) => {
                res.render('order/details', { order });
            }).catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    orderStatus: (req, res) => {
        ORDER.find({ creator: req.user.id })
            .populate({ path: 'product', populate: { path: 'category' } })
            .then((orders) => {
                res.render('order/status', { orders });
            }).catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    orderAllGet: (req, res) => {
        ORDER.find({})
            .populate({ path: 'product', populate: { path: 'category' } })
            .then((orders) => {
                res.render('order/status-admin', { orders });
            }).catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    orderAllPost: (req, res) => {
        let promisesArr = [];
        
        for (let id in req.body) {
            if (req.body.hasOwnProperty(id)) {
                promisesArr.push(updateOrderStatus(id, req.body[id]));
            }
        }

        Promise.all(promisesArr).then(() => {
            res.redirect('/');
        }).catch(() => {
            res.sendStatus(400);
        });
    }
};

function updateOrderStatus(id, newStatus) {
    return new Promise((resolve, reject) => {
        ORDER.update({ _id: id }, { status: newStatus }).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
}