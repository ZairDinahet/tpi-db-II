const Appointment = require('./appointments.model');
const patientsService = require('../patients/patients.service');
const doctorsService = require('../doctors/doctors.service');
const AppError = require('../../common/AppError');
const { validateId, allowedChanges } = require('../../common/validate');

const NOT_FOUND = 'Appointment not found or inactive';

function withDetails(query) {
  return query
    .populate('patientId', 'nationalId firstName lastName healthInsurance')
    .populate('doctorId', 'licenseNumber firstName lastName specialty');
}

async function validateReferences({ patientId, doctorId }) {
  if (patientId) {
    const patient = await patientsService.findActive(patientId);
    if (!patient) throw new AppError('Patient does not exist or is inactive', 400);
  }
  if (doctorId) {
    const doctor = await doctorsService.findActive(doctorId);
    if (!doctor) throw new AppError('Doctor does not exist or is inactive', 400);
  }
}

async function create(data) {
  const { patientId, doctorId, date, reason } = data ?? {};
  await validateReferences({ patientId, doctorId });
  return Appointment.create({ patientId, doctorId, date, reason });
}

async function list() {
  return withDetails(Appointment.find({ active: true })).sort({ date: 1 }).lean();
}

async function findById(id) {
  validateId(id);
  const appointment = await withDetails(Appointment.findOne({ _id: id, active: true })).lean();
  if (!appointment) throw new AppError(NOT_FOUND, 404);
  return appointment;
}

async function update(id, changes) {
  validateId(id);
  const allowed = allowedChanges(changes);
  await validateReferences(allowed);
  const appointment = await Appointment.findOneAndUpdate(
    { _id: id, active: true },
    { $set: allowed },
    { new: true, runValidators: true }
  ).lean();
  if (!appointment) throw new AppError(NOT_FOUND, 404);
  return appointment;
}

async function softDelete(id) {
  validateId(id);
  const appointment = await Appointment.findOneAndUpdate(
    { _id: id, active: true },
    { $set: { active: false, deletedAt: new Date() } },
    { new: true }
  ).lean();
  if (!appointment) throw new AppError(NOT_FOUND, 404);
  return appointment;
}

module.exports = { create, list, findById, update, softDelete };
