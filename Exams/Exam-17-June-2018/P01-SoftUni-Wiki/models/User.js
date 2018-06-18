const MONGOOSE = require('mongoose');
const ROLE = MONGOOSE.model('Role');
const ENCRYPTION = require('../utilities/encryption');
const STRING = MONGOOSE.Schema.Types.String;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const USER_SCHEMA = MONGOOSE.Schema({
    email: { type: STRING, required: true, unique: true },
    password: { type: STRING, required: true },
    salt: { type: STRING, required: true },
    roles: [{ type: OBJECT_ID, ref: 'Role' }]
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
    USER.findOne({ email: 'admin@admin.com' }).then((admin) => {
        if (admin) {
            return;
        }

        ROLE.findOne({ name: 'Admin' }).then((role) => {
            let salt = ENCRYPTION.generateSalt();
            let passwordHash = ENCRYPTION.generateHashedPassword(salt, 'admin');
            let adminUser = {
                email: 'admin@admin.com',
                salt: salt,
                password: passwordHash,
                roles: [role._id]
            };

            USER.create(adminUser).then((user) => {
                role.users.push(user._id);
                role.save();
            });
        });
    });
};