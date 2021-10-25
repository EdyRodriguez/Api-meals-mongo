const express = require('express');
const meal = require('../models/meals');


const app = express.Router();

app.get('/api/meals/', (req, res) => {
    meal.find()
        .exec()
        .then(meals => {
            res.status(200).send(meals);
        })
});

app.get('/api/meals/:id', (req, res) => {
    meal.findById(req.params.id)
        .exec()
        .then(meals => {
            res.status(200).send(meals);
        })
});

app.post('/api/meals/', (req, res) => {
    meal.create(req.body).then(meals => {
        res.status(201).send(meals);
    });
});

app.put('/api/meals/:id', (req, res) => {
    meal.findOneAndUpdate({ _id: req.params.id }, req.body)
        .then( () => {res.sendStatus(204)})
});

app.delete('/api/meals/:id', (req, res) => {
    meal.findOneAndDelete(req.params.id)
        .exec()
        .then( () => {res.sendStatus(204)})
});



module.exports = app;