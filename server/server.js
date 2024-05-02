require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

// Crear una aplicación Express
const app = express();

// Usar el middleware de registro de solicitudes de Morgan
app.use(morgan('dev'));

// Definir una ruta para manejar solicitudes GET a '/'
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Iniciar el servidor y escuchar en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});
