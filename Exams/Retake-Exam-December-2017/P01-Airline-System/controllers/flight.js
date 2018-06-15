const FLIGHT = require('mongoose').model('Flight');

module.exports = {
    addGet: (req, res) => {
        res.render('flight/add');
    },

    addPost: (req, res) => {
        let flight = req.body;

        FLIGHT.create({
            destination: flight.destination,
            origin: flight.origin,
            date: flight.date,
            time: flight.time,
            image: flight.image
        }).then(() => {
            req.session.msg = { success: 'Flight created!' };
            res.redirect('/');
        }).catch((err) => {
            flight.error = err;
            res.render('flight/add', flight);
        });
    },

    editGet: (req, res) => {
        let id = req.params.id;

        FLIGHT.findById(id).then((flight) => {
            if (!flight) {
                req.session.msg = { error: 'No such Flight in Database!' };
                res.redirect('/');
                return;
            }

            res.render('flight/edit', flight);
        }).catch(() => {
            req.session.msg = { error: '400 Bad Request' };
            res.redirect('/');
        });
    },

    editPost: (req, res) => {
        let id = req.params.id;
        let editedFlight = req.body;

        FLIGHT.findById(id).then((flight) => {
            if (!flight) {
                req.session.msg = { error: 'No such Flight in Database!' };
                res.redirect('/');
                return;
            }

            flight.destination = editedFlight.destination;
            flight.origin = editedFlight.origin;
            flight.date = editedFlight.date;
            flight.time = editedFlight.time;
            flight.image = editedFlight.image;

            if (editedFlight.public) {
                flight.public = true;
            } else {
                flight.public = false;
            }

            flight.save().then(() => {
                req.session.msg = { success: 'Flight Edited!' };
                res.redirect('/');
            }).catch(() => {
                flight.error = 'Flight Failed to edit!';
                res.render('flight/edit', flight);
            });

        }).catch(() => {
            req.session.msg = { error: '400 Bad Request' };
            res.redirect('/');
        });
    },

    detailsGet: (req, res) => {
        let id = req.params.id;

        FLIGHT.findById(id).populate('seats').then((flight) => {
            if (!flight) {
                req.session.msg = { error: 'No such Flight in Database!' };
                res.redirect('/');
                return;
            }

            if (!req.user.isAdmin && !flight.public) {
                res.redirect('/user/login');
                return;
            }

            res.render('flight/details', flight);
        }).catch(() => {
            req.session.msg = { error: '400 Bad Request' };
            res.redirect('/');
        });
    },

    publish: (req, res) => {
        let id = req.params.id;

        FLIGHT.findById(id).then((flight) => {
            if (!flight) {
                req.session.msg = { error: 'No such Flight in Database!' };
                res.redirect('/');
                return;
            }

            flight.public = true;

            flight.save().then(() => {
                req.session.msg = { success: 'Flight published!'};
                res.redirect('/');
            });
        }).catch(() => {
            req.session.msg = { error: '400 Bad Request' };
            res.redirect('/');
        });
    }
};