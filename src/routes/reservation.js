const express = require('express');
const uuid = require('uuid');
const reservationSchema = require('../models/reservation');
const userSchema = require('../models/user');
const roomSchema = require('../models/room');

const router = express.Router();

// crear reservación
router.post('/reservations', async (req, res) => {
    try {
        const room = await roomSchema.findOne({ numeroHabitacion: req.body.room });
        if (room && room.reservada) {
            res.status(400).json({ mensaje: 'Lo siento. La habitación ya está reservada' });
        } else {
            const reservation = new reservationSchema({
                ...req.body,
                reservationId: uuid.v4()
            });
            const savedReservation = await reservation.save();
            if (room) {
                room.reservada = true;
                await room.save();
            }
            const user = await userSchema.findOne({ userId: req.body.user });
            if (user) {
                const reservationNumber = user.reservations.length + 1;
                user.reservations.push({
                    reservationNumber: reservationNumber,
                    room: req.body.room,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate
                });
                await user.save();
            }
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

//mostrar una reservaciones por reservationId
router.get('/reservations/:reservationId', async (req, res) => {
    try {
        const reservation = await reservationSchema.findOne({ reservationId: req.params.reservationId });
        if (!reservation) {
            res.status(404).json({ mensaje: 'Reservacion no encontrada' });
        } else {
            res.json(reservation);
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la reservacion', error: error.toString() });
    }
})

//obtener las reservaciones de un Usuario
router.get('/users/:userId/reservations', async (req, res) => {
    try {
        const reservations = await reservationSchema.find({ user: req.params.userId });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las reservaciones del usuario', error: error.toString() });
    }
});

//Actualizar una reservacion
router.put('/reservations/:reservationId', async(req, res) => {
    try {
        const {reservationId} = req.params;
        const {startDate, endDate} = req.body;
        reservationSchema
        .updateOne({reservationId: reservationId}, {$set: {startDate, endDate}})
        .then((data) => res.json(data))
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la resrvacion', error: error.toString() });
    }
});


//eliminar una reservacion
router.delete('/reservations/:reservationId', async(req, res) => {
    try {
        const {reservationId} = req.params;
        const reservation = await reservationSchema.findOne({ reservationId: reservationId });
        if (reservation) {
            const room = await roomSchema.findOne({ numeroHabitacion: reservation.room });
            if (room) {
                room.reservada = false;
                await room.save();
            }
            const user = await userSchema.findOne({ userId: reservation.user });
            if (user) {
                const index = user.reservations.indexOf(reservationId);
                if (index > -1) {
                    user.reservations.splice(index, 1);
                    await user.save();
                }
            }
            await reservationSchema.deleteOne({ reservationId: reservationId });
            res.json({ mensaje: 'Reservacion eliminada exitosamente' });
        } else {
            res.status(404).json({ mensaje: 'Reservacion no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la reservacion', error: error.toString() });
    }
});



module.exports = router;
