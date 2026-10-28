const mongoose = require('mongoose');
const { softDeleteFields, blockPhysicalDelete } = require('../../common/softDelete');

// healthInsurance y address van EMBEBIDOS: pertenecen a un solo paciente, se leen
// siempre junto con él, son chicos y no se consultan por separado.
const patientSchema = new mongoose.Schema(
  {
    nationalId: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    healthInsurance: {
      _id: false,
      name: { type: String, trim: true },
      memberNumber: { type: String, trim: true },
    },
    address: {
      _id: false,
      street: { type: String, trim: true },
      city: { type: String, trim: true },
    },
    ...softDeleteFields,
  },
  { timestamps: true }
);

patientSchema.plugin(blockPhysicalDelete);

module.exports = mongoose.model('Patient', patientSchema, 'patients');
