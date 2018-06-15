const SEAT = require('mongoose').model('Seat');
const FLIGHT = require('mongoose').model('Flight');

module.exports = {
    add: (req, res) => {
        let seat = req.body;
        let id = seat.flight;
        SEAT.create({
            price: Number(seat.price),
            type: seat.type,
            freeSeats: Number(seat.freeSeats),
            flight: id
        }).then((newSeat) => {
            FLIGHT.findById(id).then((flight) => {
                flight.seats.push(newSeat._id);
                flight.save().then(() => {
                    res.redirect(`/flight/details/${id}`);
                });
            });
        }).catch((err) => {
            req.session.msg = { error: err };
            res.redirect('/');
        });
    },

    remove: (req, res) => {
        let id = req.params.id;
        SEAT.findByIdAndRemove(id).then((removedSeat) => {
            FLIGHT.update({ _id: removedSeat.flight }, { $pull: { seats: removedSeat._id } }).then(() => {
                res.redirect(`/flight/details/${removedSeat.flight.toString()}`);
            });
        }).catch(() => {
            req.session.msg = { error: '400 Bad Request' };
            res.redirect('/');
        });
    }
};