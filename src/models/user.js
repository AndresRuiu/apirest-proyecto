const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    nombre:{
        type: String,
        required:true
    },
    edad:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);