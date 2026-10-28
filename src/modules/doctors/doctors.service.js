const Doctor = require('./doctors.model');
const AppError = require('../../common/AppError');
const { validateId, allowedChanges } = require('../../common/validate');

const NOT_FOUND = 'Doctor not found or inactive';

async function create(data) {
  return Doctor.create(data);
}

async function list() {
  return Doctor.find({ active: true }).lean();
}

async function findActive(id) {
  validateId(id);
  return Doctor.findOne({ _id: id, active: true }).lean();
}

async function findById(id) {
  const doctor = await findActive(id);
  if (!doctor) throw new AppError(NOT_FOUND, 404);
  return doctor;
}

async function update(id, changes) {
  validateId(id);
  const doctor = await Doctor.findOneAndUpdate(
    { _id: id, active: true },
    { $set: allowedChanges(changes) },
    { new: true, runValidators: true }
  ).lean();
  if (!doctor) throw new AppError(NOT_FOUND, 404);
  return doctor;
}

async function softDelete(id) {
  validateId(id);
  const doctor = await Doctor.findOneAndUpdate(
    { _id: id, active: true },
    { $set: { active: false, deletedAt: new Date() } },
    { new: true }
  ).lean();
  if (!doctor) throw new AppError(NOT_FOUND, 404);
  return doctor;
}

module.exports = { create, list, findActive, findById, update, softDelete };
