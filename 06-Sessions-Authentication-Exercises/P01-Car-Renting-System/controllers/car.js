const CAR = require('mongoose').model('Car');
const CLASS = require('mongoose').model('Class');
const USER = require('mongoose').model('User');

module.exports = {
    addCarGet: (req, res) => {
        CLASS.find({}).then((classes) => {
            res.render('car/add', { classes });
        });
    },

    addCarPost: (req, res) => {
        let newCar = req.body;
        let car = {};

        car.carModel = newCar.carModel;
        car.image = newCar.image;
        car.description = newCar.description;
        car.pricePerDay = newCar.pricePerDay;
        car.class = newCar.class;

        CAR.create(car).then((car) => {
            CLASS.findById(car.class).then((cls) => {
                cls.cars.push(car._id);
                cls.save().then(() => {
                    req.session.msg = { success: 'Car created!' };
                    res.redirect('/');
                });
            });
        }).catch((err) => {
            car.error = err;
            CLASS.find({}).then((classes) => {
                res.render('car/add', { classes, car });
            });
        });
    },

    editCarGet: (req, res) => {
        let id = req.params.id;

        CAR.findById(id).then((car) => {
            CLASS.find({}).then((classes) => {
                res.render('car/edit', { classes, car });
            });
        }).catch((err) => {
            console.log(err);
            req.session.msg = { error: '400 - Bad Request!' };
            res.redirect('/');
        });
    },

    editCarPost: (req, res) => {
        let id = req.params.id;
        let car = req.body;

        CAR.findById(id).then((oldCar) => {
            oldCar.carModel = car.carModel;
            oldCar.image = car.image;
            oldCar.description = car.description;
            oldCar.pricePerDay = car.pricePerDay;
            oldCar.class = car.class;

            oldCar.save().then(() => {
                req.session.msg = { success: 'Car edited!' };
                res.redirect('/');
            }).catch((err) => {
                car.error = err;
                CLASS.find({}).then((classes) => {
                    res.render('car/edit', { classes, car });
                });
            });
        }).catch((err) => {
            console.log(err);
            req.session.msg = { error: '400 - Bad Request!' };
            res.redirect('/');
        });
    },

    getAllCars: (req, res) => {
        CAR.find({ isRented: false }).then((cars) => {
            CLASS.find({}).then((classes) => {
                res.render('car/result', { classes, cars });
            });
        }).catch((err) => {
            console.log(err);
            req.session.msg = { error: '400 - Bad Request!' };
            res.redirect('/');
        });
    },

    search: (req, res) => {
        if (!req.query.class) {
            res.redirect('cars/all');
            return;
        }

        if (req.query.class === '' || req.query.class === 'all') {
            res.redirect('cars/all');
            return;
        }

        CLASS.findOne({ _id: req.query.class })
            .populate('cars')
            .then((cls) => {
                CLASS.find({}).then((classes) => {
                    let cars = cls.cars.filter(c => c.isRented === false);
                    res.render('car/result', { classes, cars });
                });
            }).catch((err) => {
                console.log(err);
                req.session.msg = { error: '400 - Bad Request!' };
                res.redirect('/');
            });
    },

    rentCarGet: (req, res) => {
        let id = req.params.id;
        CAR.findById(id).populate('class').then((car) => {
            res.render('car/rent', car);
        }).catch((err) => {
            console.log(err);
            req.session.msg = { error: '400 - Bad Request!' };
            res.redirect('/');
        });
    },

    rentCarPost: (req, res) => {
        let id = req.params.id;
        let days = Number(req.body.days);

        CAR.findById(id).populate('class').then((car) => {
            USER.findById(req.user._id).then((user) => {
                let expDate = new Date();
                expDate.setDate(expDate.getDate() + days);
                car['expireDateFormated'] = expDate.toISOString().slice(0, 10);
                car.rentExpireDate = expDate;
                car.isRented = true;
                user.rentedCars.push(car._id);

                car.save().then(() => {
                    user.save().then(() => {
                        req.session.msg = { success: 'Car rented!' };
                        res.redirect('/');
                    });
                });
            });

        }).catch((err) => {
            console.log(err);
            req.session.msg = { error: '400 - Bad Request!' };
            res.redirect('/');
        });
    }
};