const express = require('express');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const patients = require('./modules/patients');
const doctors = require('./modules/doctors');
const appointments = require('./modules/appointments');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'Medical appointments API',
    resources: {
      patients: '/patients',
      doctors: '/doctors',
      appointments: '/appointments',
    },
  });
});

app.use('/patients', patients);
app.use('/doctors', doctors);
app.use('/appointments', appointments);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
