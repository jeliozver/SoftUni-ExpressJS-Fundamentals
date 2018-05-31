const MONGOOSE = require('mongoose');
const CONNECTION = 'mongodb://localhost:27017/mongooseDemo';
const STUDENT = require('./models/Student').Student;
const COURSE = require('./models/Course');

MONGOOSE.Promise = global.Promise;

MONGOOSE.connect(CONNECTION).then(() => {
    STUDENT.find({})
        .where('age').gt(19).lt(40)
        .sort('firstName')
        .then((students) => {
            for (let student of students) {
                console.log(student.description);
            }
        }).catch((err) => {
            console.log(err);
        });

    STUDENT.findOne()
        .where('facultyNumber')
        .equals('2018003')
        .then((student) => {
            console.log(student.description);
        }).catch((err) => {
            console.log(err);
        });
});