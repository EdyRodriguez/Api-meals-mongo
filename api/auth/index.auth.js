const jwt = require('jsonwebtoken');
const users = require('../models/users');


const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(403);
  }
  jwt.verify(token, 'secreto-de-amor', (err, decoded) => {
      
    const { id } = decoded;
        users.findById(id).exec().then(
            (user => {
                req.user = user
                next();
            }),
        );
  });
};

const hasRoles = roles => (req, res, next) => {
    if (roles.indexOf(req.user.role) === -1) {
     return next();
    }
    return res.sendStatus(403);
}

module.exports = {
    isAuthenticated,
    hasRoles
}