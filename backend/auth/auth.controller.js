const User = require('./auth.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';

//guardar los datos del frontend
exports.createUser = (req, res, next) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    }
    //recibir el usuario o un error
    User.create(newUser, (err, user) => {

        if (err && err.code ==11000) return res.status(409).send('El correo ya existe!')
        if (err) return res.status(500).send('Server error');
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({
                id: user.id
            },
            SECRET_KEY, {
                expiresIn: expiresIn
            });
            //datos a mandar
            const dataUser = {
                name: user.name,
                email: user.email,
                accessToken: accessToken,
                expiresIn: expiresIn
            }
        // response
        res.send({
            dataUser
        });
    })
}

exports.loginUser = (req, res, next) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    }
    User.findOne({
        email: userData.email
    }, (err, user) => {
        if (err) return res.status(500).send('Server error');

        if (!user) {
            //email doesn't exist
            res.status(409).send({
                message: 'Something is wrong'
            });
            // verificar si la contraseña es la correcta
        } else {
            const resultPassword = bcrypt.compareSync(userData.password, user.password);
            if (resultPassword) {
                const expiresIn = 24 * 60 * 60;
                
                const accessToken = jwt.sign({
                    id: user.id
                }, SECRET_KEY, {
                    expiresIn: expiresIn
                });
                const dataUser = {
                    name: user.name,
                    email: user.email,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
                res.send({
                    userData
                });

            } else {
                //password wrong
                res.status(409).send({
                    message: 'Somethins is wrong'
                });
            }
        }
    });
}