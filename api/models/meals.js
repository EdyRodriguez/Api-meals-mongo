const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const meal = mongoose.model('Meal', new Schema({
    name: String,
    description: String,
    price: Number,


}));

module.exports = meal;