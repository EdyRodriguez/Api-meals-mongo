const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const order = mongoose.model('Order', new Schema({
    meal_id: String,
    user_id: String,
    quantity: Number,
}));

module.exports = order;