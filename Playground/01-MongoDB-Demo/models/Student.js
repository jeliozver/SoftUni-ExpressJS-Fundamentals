const MONGOOSE = require('mongoose');

const STUDENT_SCHEMA = new MONGOOSE.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    facultyNumber: { type: String, required: true, unique: true },
    age: { type: Number }
});

STUDENT_SCHEMA.methods.sayHello = function () {
    return `Hello, I am ${this.firstName} ${this.lastName} and I'm ${this.age} years old`;
};

STUDENT_SCHEMA.virtual('description').get(function () {
    return `Student: ${this.firstName} ${this.lastName}, Age:${this.age}, Faculty Number:${this.facultyNumber}`;
});

STUDENT_SCHEMA.path('firstName').validate(function () {
    return this.firstName.length >= 2 && this.firstName.length <= 10;
}, 'First name must be between 2 and 10 symbols long!');


module.exports = {
    Student: MONGOOSE.model('Student', STUDENT_SCHEMA),
    Schema: STUDENT_SCHEMA
};