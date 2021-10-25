const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const meal = require('./models/meals');
const {isAuthenticated, hasRoles} = require('./auth/index.auth');
const order = require('./models/orders');
const users = require('./models/users');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
app.use(bodyParser.json());
app.use(cors());
//connects to the database
try {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    mongoose.connection.on('error', err => {
        logError(err);
    });
} catch (error) {
    console.log(error);
}
// Meats routes
app.get('/api/meals/',isAuthenticated, (req, res) => {
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

app.post('/api/meals/',  (req, res) => {
    meal.create(req.body).then(meals => {
        res.status(201).send(meals);
    });
});

app.put('/api/meals/:id',  (req, res) => {
    meal.findOneAndUpdate({
            _id: req.params.id
        }, req.body)
        .then(() => {
            res.sendStatus(204)
        })
});

app.delete('/api/meals/:id', (req, res) => {
    meal.findOneAndDelete(req.params.id)
        .exec()
        .then(() => {
            res.sendStatus(204)
        })
});
// Orders routes
app.get('/api/orders/', (req, res) => {
    order.find()
        .exec()
        .then(order => {
            res.status(200).send(order);
        })
});

app.get('/api/orders/:id', (req, res) => {
    order.findById(req.params.id)
        .exec()
        .then(order => {
            res.status(200).send(order);
        })
});

app.post('/api/orders/', isAuthenticated, (req, res) => {
    const {id} = req.user;
    console.log(id);
    
    
    order.create({...req.body, user_id: id}).then(order => {
        res.status(201).send(order);
    });
});

app.put('/api/orders/:id',isAuthenticated, (req, res) => {
    order.findOneAndUpdate({
            _id: req.params.id
        }, req.body)
        .then(() => {
            res.sendStatus(204)
        })
});

app.delete('/api/orders/:id', isAuthenticated,(req, res) => {
    order.findOneAndDelete(req.params.id)
        .exec()
        .then(() => {
            res.sendStatus(204)
        })
});


//endpoint for registering a new user
app.post('/api/register/', (req, res) => {
    const {
        email,
        password
    } = req.body;
    const mail = email.toString().toLowerCase();
    crypto.randomBytes(16, (err, salt) => {
        const newSalt = salt.toString('base64');
        crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (err, key) => {
            const newKey = key.toString('base64');
            users.findOne({email}).exec().then(user => {
                if (user) {
                  return  res.send("user already exists");
                } 
                
                    users.create({
                            email: mail,
                            password: newKey,
                            salt: newSalt
                        })
                        .then(() => {
                           res.send(
                                'User created Succesfully'
                            );
                        });
                
            });
        });
    });
});
//endpoint for login
app.post('/api/login/', (req, res) => {
    const {email, password} = req.body;
    users.findOne({email}).exec().then(user => {
        if (user) {
            crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (err, key) => {
                const newKey = key.toString('base64');
                if (newKey === user.password) {
                    const token = signToken(user.id);
                   return res.status(200).send({
                        token:{token},
                        message: 'User logged in'
                    });
                } else {
                  return  res.status(400).send({
                        error: 'Invalid user/password'
                    });
                }
            });
        } else {
           return res.send('Invalid user/password');
        }
    });

});

app.get('/api/me',isAuthenticated,(req, res) => {   
    const {id} = req.user;
    users.findById(id).exec().then(user => {
        res.status(200).send(user);
    });
});

//encripts the token and returns it
const signToken = (id) => {
    return jwt.sign({
        id
    }, 'secreto-de-amor',{expiresIn: 60*60*24*365});
};
module.exports = app;