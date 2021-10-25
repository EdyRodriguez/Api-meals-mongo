const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const users = mongoose.model('User', new Schema({
    email: String,
    password: String,
    salt: String,
    role: {type: String, default: 'user'}, //admin

}));

module.exports = users;