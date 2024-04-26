const express = require('express');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userSchema = require('../models/user')

const router = express.Router();

//crear usuario
router.post('/users', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (err) {
            console.error(err);
            res.status(500).json({ mensaje: 'Error al encriptar la contraseña', error: err.toString()});
        } else {
            const user = new userSchema({
                ...req.body,
                userId: uuid.v4(),
                reservations: [],
                password: hash
            });
            user
                .save()
                .then((data) => res.json(data))
                .catch((error) => res.json({ mensaje: error }));
        }
    });
});

// obtener todos los usuarios
router.get('/users', (req, res) => {
    userSchema.find()
        .populate('reservations')
        .then((users) => {
            users.forEach(user => {
                if (!user.reservations.length) {
                    user.reservations = 'El usuario no tiene reservas';
                }
            });
            res.json(users);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error });
        });
});

// obtener un usuario
router.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    userSchema.findOne({ userId: userId })
        .populate('reservations')
        .then((user) => {
            if (!user) {
                res.status(404).json({ mensaje: 'Usuario no encontrado' });
            } else {
                if (!user.reservations.length) {
                    user.reservations = 'El usuario no tiene reservas';
                }
                res.json(user);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ mensaje: 'Error al obtener el usuario', error: error });
        });
});


//actualizar un usuario
//proximamente usar patch para solo actualizar el usuario o la contraseña
router.put('/users/:userId', (req,res) =>{
    const {userId} = req.params;
    const {userName,password, email} = req.body;
    userSchema
     .updateOne({userId: userId}, {$set: {userName,password, email}})
     .then((data) => res.json(data))
     .catch((error) => res.json({mensaje: error}));
})

//eliminar un usuario 
router.delete('/users/:userId', (req,res) =>{
    const {userId} = req.params;
    userSchema
     .deleteOne({userId: userId})
     .then((data) => res.json(data))
     .catch((error) => res.json({mensaje: error}));
})

module.exports = router;