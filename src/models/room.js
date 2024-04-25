const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    numeroHabitacion: {
        type: Number,
        required: true,
        unique: true
    },
    tipoHabitacion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    reservada: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Room', roomSchema);
