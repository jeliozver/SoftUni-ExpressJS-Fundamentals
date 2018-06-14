const MONGOOSE = require('mongoose');
const ROLE = MONGOOSE.model('Role');
const ENCRYPTION = require('../utilities/encryption');
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const USER_SCHEMA = MONGOOSE.Schema({
    username: { type: STRING, required: true, unique: true },
    email: { type: STRING, required: true, unique: true },
    password: { type: STRING, required: true },
    salt: { type: STRING, required: true },
    firstName: { type: STRING, required: true },
    lastName: { type: STRING, required: true },
    age: { type: NUMBER, required: true, min: 18, max: 70 },
    roles: [{ type: OBJECT_ID, ref: 'Role' }],
    rentedCars: [{ type: OBJECT_ID, ref: 'Car' }]
});

USER_SCHEMA.method({
    authenticate: function (password) {
        let hashedPassword = ENCRYPTION.generateHashedPassword(this.salt, password);

        if (hashedPassword === this.password) {
            return true;
        }

        return false;
    }
});

const USER = MONGOOSE.model('User', USER_SCHEMA);

module.exports = USER;

module.exports.init = () => {
    USER.findOne({ username: 'admin' }).then((admin) => {
        if (admin) {
            return;
        }

        ROLE.findOne({ name: 'Admin' }).then((role) => {
            let salt = ENCRYPTION.generateSalt();
            let passwordHash = ENCRYPTION.generateHashedPassword(salt, 'admin');
            let adminUser = {
                username: 'admin',
                email: 'adminAdminov@gmail.com',
                firstName: 'Admin',
                lastName: 'Adminov',
                salt: salt,
                password: passwordHash,
                age: 28,
                roles: [role._id]
            };

            USER.create(adminUser).then((user) => {
                role.users.push(user._id);
                role.save();
            });
        });
    });
};