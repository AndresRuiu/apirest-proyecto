const express = require('express');
const mongoose = require('mongoose')
const roomSchema = require('../models/room')

const router = express.Router();

// crear habitación
router.post('/rooms', async (req, res) => {
    try {
        const totalRooms = await roomSchema.countDocuments({});
        const room = new roomSchema({
            ...req.body,
            numeroHabitacion: totalRooms + 1
        });
        const savedRoom = await room.save();
        res.json(savedRoom);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la habitación', error: error.toString() });
    }
});

// obtener todas las habitaciones
router.get('/rooms', async (req, res) => {
    try {
        const rooms = await roomSchema.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las habitaciones', error: error.toString() });
    }
});

// obtener una habitación
router.get('/rooms/:numeroHabitacion', async (req, res) => {
    try {
        const room = await roomSchema.findOne({ numeroHabitacion: req.params.numeroHabitacion });
        if (!room) {
            res.status(404).json({ mensaje: 'Habitación no encontrada' });
        } else {
            res.json(room);
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la habitación', error: error.toString() });
    }
});

// actualizar el precio de una habitación
router.patch('/rooms/:numeroHabitacion', async (req, res) => {
    try {
        const updatedRoom = await roomSchema.findOneAndUpdate(
            { numeroHabitacion: req.params.numeroHabitacion },
            { precio: req.body.precio },
            { new: true }
        );
        if (!updatedRoom) {
            res.status(404).json({ mensaje: 'Habitación no encontrada' });
        } else {
            res.json(updatedRoom);
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la habitación', error: error.toString() });
    }
});

module.exports = router;