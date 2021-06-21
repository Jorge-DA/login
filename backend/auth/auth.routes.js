const Users = require('./auth.controller');
module.exports = (routes) => {
    routes.post('/register', Users.createUser);
    routes.post('/login', Users.loginUser);

}