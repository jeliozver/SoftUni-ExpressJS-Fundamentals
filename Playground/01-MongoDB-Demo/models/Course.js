const MONGOOSE = require('mongoose');
const STUDENT_SCHEMA = require('../models/Student').Schema;

const COURSE_SCHEMA = new MONGOOSE.Schema({
    name: { type: String, required: true, index: true },
    isOpen: { type: Boolean, required: true },
    students: [STUDENT_SCHEMA]
});

module.exports = MONGOOSE.model('Course', COURSE_SCHEMA);