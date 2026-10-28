const mongoose = require('mongoose');
const { softDeleteFields, blockPhysicalDelete } = require('../../common/softDelete');

// schedules va EMBEBIDO: es un arreglo acotado (pocos bloques por semana) y
// no tiene sentido fuera del médico al que pertenece.
const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    },
    from: { type: String, required: true }, // "08:00"
    to: { type: String, required: true }, // "12:00"
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    licenseNumber: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    office: { type: String, trim: true },
    schedules: [scheduleSchema],
    ...softDeleteFields,
  },
  { timestamps: true }
);

doctorSchema.plugin(blockPhysicalDelete);

module.exports = mongoose.model('Doctor', doctorSchema, 'doctors');
