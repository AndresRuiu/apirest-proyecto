const express = require('express');
const uuid = require('uuid');
const reservationSchema = require('../models/reservation');
const userSchema = require('../models/user');
const roomSchema = require('../models/room');

const router = express.Router();

// crear reservación
router.post('/users/:userId/reservations', async (req, res) => {
    const { userId } = req.params;
    try {
        const room = await roomSchema.findOne({ numeroHabitacion: req.body.room });
        if (room && room.reservada) {
            res.status(400).json({ mensaje: 'Lo siento. La habitación ya está reservada' });
        } else {
            const reservation = new reservationSchema({
                ...req.body,
                user: userId,
                reservationId: uuid.v4()
            });
            if (room) {
                room.reservada = true;
                await room.save();
            }
            const user = await userSchema.findOne({ userId: userId });
            if (user) {
                const reservationNumber = user.reservations.length + 1;
                user.reservations.push({
                    reservationId: reservation.reservationId,
                    reservationNumber: reservationNumber,
                    room: req.body.room,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate
                });
                await user.save();
            }
            const savedReservation = await reservation.save();
            res.json(`Se a registrado en la habitacion ${room.numeroHabitacion}`);
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la reservación', error: error.toString() });
    }
});


// Mostrar todas las reservaciones
router.get('/reservations', async (req, res) => {
    try {
        const reservations = await reservationSchema.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las reservaciones', error: error.toString() });
    }
})

// Mostrar todas las reservaciones de un usuario
router.get('/users/:userId/reservations', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userSchema.findOne({ userId: userId });
        if (user) {
            res.json(user.reservations);
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las reservaciones', error: error.toString() });
    }
});

// Mostrar una reservación específica de un usuario
router.get('/users/:userId/reservations/:reservationId', async (req, res) => {
    const { userId, reservationId } = req.params;
    try {
        const user = await userSchema.findOne({ userId: userId });
        if (user) {
            const reservation = user.reservations.find(r => r.reservationId === reservationId);
            if (reservation) {
                res.json(reservation);
            } else {
                res.status(404).json({ mensaje: 'Reservación no encontrada' });
            }
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la reservación', error: error.toString() });
    }
});

// Actualizar una reservación de un usuario
router.put('/users/:userId/reservations/:reservationId', async(req, res) => {
    const { userId, reservationId } = req.params;
    const { room, startDate, endDate } = req.body;
    try {
        const user = await userSchema.findOne({ userId: userId });
        if (user) {
            const reservation = user.reservations.find(r => r.reservationId === reservationId);
            if (reservation) {
                reservation.room = room;
                reservation.startDate = startDate;
                reservation.endDate = endDate;
                await user.save();
                res.json(reservation);
            } else {
                res.status(404).json({ mensaje: 'Reservación no encontrada' });
            }
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la reservación', error: error.toString() });
    }
});

// Eliminar una reservación de un usuario
router.delete('/users/:userId/reservations/:reservationId', async(req, res) => {
    const { userId, reservationId } = req.params;
    try {
        const user = await userSchema.findOne({ userId: userId });
        if (user) {
            const index = user.reservations.findIndex(r => r.reservationId === reservationId);
            if (index > -1) {
                user.reservations.splice(index, 1);
                await user.save();
                res.json({ mensaje: 'Reservación eliminada exitosamente' });
            } else {
                res.status(404).json({ mensaje: 'Reservación no encontrada' });
            }
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la reservación', error: error.toString() });
    }
});




module.exports = router;
