const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    reservationId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    room: {
        type: Number,
        ref: 'Room',
        required: true
    },
    startDate:{
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Reservation', reservationSchema);