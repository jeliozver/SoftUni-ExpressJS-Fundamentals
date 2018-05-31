const MONGOOSE = require('mongoose');
const CONNECTION = 'mongodb://localhost:27017/mongooseDemo';

let Student = MONGOOSE.model('Student', {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    facultyNumber: { type: String, required: true, unique: true },
    age: { type: Number }
});

let Course = MONGOOSE.model('Course', {
    name: { type: String, required: true, index: true },
    isOpen: { type: Boolean, required: true },
    students: [Student.schema]
});

MONGOOSE.connect(CONNECTION).then(() => {
    asyncCreate();
});

function asyncCreate() {
    let firstStudent = new Student({
        firstName: 'Georges',
        lastName: 'St-Pierre',
        facultyNumber: '2018003',
        age: 38
    });

    let secondStudent = new Student({
        firstName: 'Jon',
        lastName: 'Johnes',
        facultyNumber: '2018004',
        age: 26
    });

    let mathsCourse = new Course({
        name: 'Maths',
        isOpen: true,
        students: [firstStudent, secondStudent]
    });

    console.log(firstStudent);
    console.log(secondStudent);
    console.log(mathsCourse);

    firstStudent.save().then((sInfo) => {
        console.log(sInfo);
    }).catch((err) => {
        console.log(err);
    });

    secondStudent.save().then((sInfo) => {
        console.log(sInfo);
    }).catch((err) => {
        console.log(err);
    });

    mathsCourse.save().then((cInfo) => {
        console.log(cInfo);
    }).catch((err) => {
        console.log(err);
    });
}