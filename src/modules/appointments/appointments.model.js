const mongoose = require('mongoose');
const { softDeleteFields, blockPhysicalDelete } = require('../../common/softDelete');

// patientId y doctorId son LINKING (referencias): un paciente o un médico
// acumulan turnos sin límite con los años, así que embeberlos haría crecer el
// documento sin control. Además los turnos se consultan por sí solos.
//
// "status" es un estado de NEGOCIO (un turno cancelado sigue activo).
// La baja lógica es otra cosa: active = false.
const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    date: { type: Date, required: true },
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ['scheduled', 'attended', 'cancelled'],
      default: 'scheduled',
    },
    ...softDeleteFields,
  },
  { timestamps: true }
);

appointmentSchema.plugin(blockPhysicalDelete);

module.exports = mongoose.model('Appointment', appointmentSchema, 'appointments');
