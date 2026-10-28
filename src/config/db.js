const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/appointments_db';

async function connect() {
  await mongoose.connect(URI);
  console.log(`Connected to MongoDB (database: ${mongoose.connection.name})`);
}

async function disconnect() {
  await mongoose.disconnect();
  console.log('Connection closed');
}

module.exports = { connect, disconnect };
