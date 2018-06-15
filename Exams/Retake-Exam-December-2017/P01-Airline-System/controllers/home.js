const FLIGHT = require('mongoose').model('Flight');

module.exports = {
    index: (req, res) => {

        if (req.user) {
            if (req.user.isAdmin) {
                getAll().then((flights) => {
                    continueResponse(req, res, flights);
                }).catch(() => {
                    res.sendStatus(400);
                });
            } else {
                getUserAnon().then((flights) => {
                    continueResponse(req, res, flights);
                }).catch(() => {
                    res.sendStatus(400);
                });
            }
        } else {
            getUserAnon().then((flights) => {
                continueResponse(req, res, flights);
            }).catch(() => {
                res.sendStatus(400);
            });
        }
    }
};

function getUserAnon() {
    return new Promise((resolve, reject) => {
        FLIGHT.find({ public: true }).then((flights) => {
            resolve(flights);
        }).catch((err) => {
            console.log(err);
            reject();
        });
    });
}

function getAll() {
    return new Promise((resolve, reject) => {
        FLIGHT.find({}).then((flights) => {
            resolve(flights);
        }).catch((err) => {
            console.log(err);
            reject();
        });
    });
}

function continueResponse(req, res, flights) {
    if (req.session.msg) {
        let msg = req.session.msg;
        req.session.msg = undefined;
        res.render('home/index', { msg, flights });
    } else {
        res.render('home/index', { flights });
    }
}