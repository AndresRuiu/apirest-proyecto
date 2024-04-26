const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/user');
const roomRoutes = require('./routes/room');
const reservationRoutes = require('./routes/reservation');

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', roomRoutes);
app.use('/api', reservationRoutes);

//routes
app.get('/', (req, res) => {
    res.send('Bienvenidos al servidor');
});

//mongodb connect
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error(error));

app.listen(port, ()=> console.log(`El servidor se esta escuchando en el puerto ${port}`));