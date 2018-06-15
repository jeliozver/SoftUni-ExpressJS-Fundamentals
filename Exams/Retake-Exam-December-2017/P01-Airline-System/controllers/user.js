const ROLE = require('mongoose').model('Role');
const USER = require('mongoose').model('User');
const TICKET = require('mongoose').model('Ticket');
const SEAT = require('mongoose').model('Seat');
const ENCRYPTION = require('../utilities/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost: (req, res) => {
        let user = req.body;

        if (user.password && user.password !== user.confirmedPassword) {
            user.error = 'Passwords do not match!';
            res.render('user/register', user);
            return;
        }

        let salt = ENCRYPTION.generateSalt();
        user.salt = salt;

        if (user.password) {
            let hashedPassword = ENCRYPTION.generateHashedPassword(salt, user.password);
            user.password = hashedPassword;
        }

        ROLE.findOne({ name: 'User' }).then((role) => {
            user.roles = [role._id];
            USER.create(user).then((newUser) => {
                role.users.push(newUser._id);
                role.save();
                req.logIn(newUser, (err) => {
                    if (err) {
                        res.render('user/register', { error: 'Authentication not working!' });
                        return;
                    }

                    req.session.msg = { success: 'Registration successfull!' };
                    res.redirect('/');
                });
            }).catch((err) => {
                user.error = err;
                res.render('user/register', user);
            });
        });
    },

    loginGet: (req, res) => {
        if (req.session.msg) {
            let msg = req.session.msg;
            req.session.msg = undefined;
            res.render('user/login', msg);
        } else {
            res.render('user/login');
        }
    },

    loginPost: (req, res) => {
        let userToLogin = req.body;

        USER.findOne({ email: userToLogin.email }).then((user) => {
            if (!user || !user.authenticate(userToLogin.password)) {
                res.render('user/login', { error: 'Invalid credentials!' });
                return;
            }

            req.logIn(user, (err, user) => {
                if (err) {
                    res.render('user/login', { error: 'Authentication not working!' });
                    return;
                }

                req.session.msg = { success: 'Login successfull!' };
                res.redirect('/');
            });
        });
    },

    logout: (req, res) => {
        req.session.msg = { success: 'Logout successfull!' };
        req.logout();
        res.redirect('/');
    },

    cartGet: (req, res) => {
        USER.findById(req.user.id).populate({ path: 'cart', populate: { path: 'flight' } }).then((user) => {
            res.render('user/cart', { cart: user.cart });
        }).catch(() => {
            req.session.msg = { error: '400 - Bad Request' };
            res.redirect('/');
        });
    },

    cartPost: (req, res) => {
        let seatId = req.body.seat;

        SEAT.findById(seatId).then((seat) => {
            let bookedSeats = Number(req.body.seats);

            TICKET.create({
                flight: seat.flight,
                seat: seat._id,
                type: seat.type,
                pricePerSeat: seat.price,
                bookedSeats: bookedSeats,
                total: bookedSeats * seat.price
            }).then((ticket) => {
                USER.findById(req.user.id).then((user) => {
                    user.cart.push(ticket._id);
                    user.save().then(() => {
                        res.redirect('/user/cart');
                    });
                });
            });
        });
    },

    buyTicket: (req, res) => {
        let ticketId = req.params.id;
        
        TICKET.findById(ticketId).then((ticket) => {
            USER.update({ _id: req.user.id },
                { $pull: { cart: ticketId }, $push: { purchasedTickets: ticketId } })
                .then(() => {
                    SEAT.findById(ticket.seat).then((seat) => {
                        seat.freeSeats -= ticket.bookedSeats;
                        seat.save().then(() => {
                            res.redirect('/user/cart');
                        });
                    });
                });
        });
    },

    removeTicket: (req, res) => {
        let ticketId = req.params.id;
        TICKET.findByIdAndRemove(ticketId).then(() => {
            USER.update({ _id: req.user.id }, { $pull: { cart: ticketId } }).then(() => {
                res.redirect('/user/cart');
            });
        }).catch(() => {
            req.session.msg = { error: '400 - Bad Request' };
            res.redirect('/');
        });
    },

    profile: (req, res) => {
        USER.findById(req.user.id).populate({ path: 'purchasedTickets', populate: { path: 'flight' } }).then((user) => {
            res.render('user/profile', { tickets: user.purchasedTickets });
        }).catch(() => {
            req.session.msg = { error: '400 - Bad Request' };
            res.redirect('/');
        });
    }
};