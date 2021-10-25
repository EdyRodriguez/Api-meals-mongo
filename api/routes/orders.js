const express = require('express');
const order = require('../models/orders');


const app = express.Router();
app.get('/api/orders/', (req, res) => {
    order.find()
        .exec()
        .then(meals => {
            res.status(200).send(meals);
        })
});

app.get('/api/orders/:id', (req, res) => {
    OrderSchema.findById(req.params.id)
        .exec()
        .then(meals => {
            res.status(200).send(meals);
        })
});

app.post('/api/orders/', (req, res) => {
    OrderSchema.create(req.body).then(meals => {
        res.status(201).send(meals);
    });
});

app.put('/api/orders/:id', (req, res) => {
    OrderSchema.findOneAndUpdate({ _id: req.params.id }, req.body)
        .then( () => {res.sendStatus(204)})
});

app.delete('/api/orders/', (req, res) => {
    OrderSchema.findOneAndDelete(req.params.id)
        .exec()
        .then( () => {res.sendStatus(204)})
});

module.exports = app;