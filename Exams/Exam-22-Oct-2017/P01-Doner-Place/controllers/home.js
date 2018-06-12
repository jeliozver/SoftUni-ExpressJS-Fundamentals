const CATEGORY = require('mongoose').model('Category');

module.exports = {
    index: (req, res) => {
        if (req.user) {
            if (req.user.isAdmin) {
                getProducts().then((result) => {
                    admin(req, res, result);
                }).catch(() => res.sendStatus(400));
            } else {
                getProducts().then((result) => {
                    userAnnon(req, res, result);
                }).catch(() => res.sendStatus(400));
            }
        } else {
            getProducts().then((result) => {
                userAnnon(req, res, result);
            }).catch(() => res.sendStatus(400));
        }
    }
};

function userAnnon(req, res, result) {
    if (req.session.msg) {
        let msg = req.session.msg;
        req.session.msg = undefined;
        res.render('home/index', { msg: msg, result });
    } else {
        res.render('home/index', { result });
    }
}

function admin(req, res, result) {
    if (req.session.msg) {
        let msg = req.session.msg;
        req.session.msg = undefined;
        res.render('home/index-admin', { msg: msg, result });
    } else {
        res.render('home/index-admin', { result });
    }
}

function getProducts() {
    return new Promise((resolve, reject) => {
        Promise.all([
            CATEGORY.findOne({ name: 'Chicken' }).populate('products'),
            CATEGORY.findOne({ name: 'Beef' }).populate('products'),
            CATEGORY.findOne({ name: 'Lamb' }).populate('products')
        ]).then((result) => {
            resolve(result);
        }).catch((err) => {
            console.log(err);
            reject();
        });
    });
}