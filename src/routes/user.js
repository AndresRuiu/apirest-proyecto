const express = require('express');
const uuid = require('uuid');
const userSchema = require('../models/user')

const router = express.Router();

//crear usuario
router.post('/users', (req,res) =>{
   const user = new userSchema({
       ...req.body,
       userId: uuid.v4()
   });
   user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({mensaje: error}));
})

//obtener todos los usuarios
router.get('/users', (req,res) =>{
    userSchema
     .find()
     .then((data) => res.json(data))
     .catch((error) => res.json({mensaje: error}));
 })
 
//obtener un usuario 
router.get('/users/:userId', (req,res) =>{
    const {userId} = req.params;
    userSchema
     .findOne({userId: userId})
     .then((data) => res.json(data))
     .catch((error) => res.json({mensaje: error}));
})

//actualizar un usuario 
router.put('/users/:userId', (req,res) =>{
    const {userId} = req.params;
    const {nombre, edad, email} = req.body;
    userSchema
     .updateOne({userId: userId}, {$set: {nombre, edad, email}})
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