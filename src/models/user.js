const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    userName:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    reservations: [{
        type: String,
        ref: 'Reservation'
    }]
});

module.exports = mongoose.model('User', userSchema);
