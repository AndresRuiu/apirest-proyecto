const express = require('express');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userSchema = require('../models/user')

const router = express.Router();

//crear usuario
router.post('/users', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        const user = new userSchema({
            ...req.body,
            userId: uuid.v4(),
            reservations: [],
            password: hash
        });
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: 'Error al encriptar la contraseña', error: err.toString()});
    }
});


// obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await userSchema.find().populate('reservations');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error });
    }
});

// obtener un usuario
router.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userSchema.findOne({ userId: userId }).populate('reservations');
        if (!user) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener el usuario', error: error });
    }
});


//actualizar un usuario
//proximamente usar patch para solo actualizar el usuario o la contraseña
router.put('/users/:userId', async (req,res) =>{
    const {userId} = req.params;
    const {userName,password, email} = req.body;
    try {
        const data = await userSchema.updateOne({userId: userId}, {$set: {userName,password, email}});
        res.json(data);
    } catch (error) {
        res.json({mensaje: 'Error al actualizar el usuario', error: error});
    }
})

//eliminar un usuario 
router.delete('/users/:userId', async (req,res) =>{
    const {userId} = req.params;
    try {
        const data = await userSchema.deleteOne({userId: userId});
        res.json(data);
    } catch (error) {
        res.json({mensaje: error});
    }
})

module.exports = router;