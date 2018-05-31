const MONGOOSE = require('mongoose');
const CONNECTION = 'mongodb://localhost:27017/mongooseDemo';
const STUDENT = require('./models/Student').Student;

MONGOOSE.Promise = global.Promise;
let id = '';

MONGOOSE.connect(CONNECTION).then(() => {
    create(() => {
        read(() => {
            update(() => {
                remove();
            });
        });
    });
});

function create(callback) {
    let newStudent = new STUDENT({
        firstName: 'Dexter',
        lastName: 'Morgan',
        facultyNumber: '2018005',
        age: 30
    });

    newStudent.save().then((sInfo) => {
        console.log(`Student ${sInfo.description} created!`);
        id = sInfo._id;
        callback();
    }).catch((err) => {
        console.log(err);
    });
}

function read(callback) {
    STUDENT.findById(id).then((student) => {
        console.log(student.sayHello());
        callback();
    }).catch((err) => {
        console.log(err);
    });
}

function update(callback) {
    STUDENT.findByIdAndUpdate(id, {
        $set: {
            firstName: 'Yagami',
            lastName: 'Raito',
            age: 18
        }
    }).then(() => {
        callback();
    }).catch((err) => {
        console.log(err);
    });
}

function remove() {
    STUDENT.findByIdAndRemove(id).then((removed) => {
        console.log(`Student ${removed.description} deleted!`);
    }).catch((err) => {
        console.log(err);
    });
}