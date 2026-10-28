const Patient = require('./patients.model');
const AppError = require('../../common/AppError');
const { validateId, allowedChanges } = require('../../common/validate');

const NOT_FOUND = 'Patient not found or inactive';

async function create(data) {
  return Patient.create(data);
}

async function list() {
  return Patient.find({ active: true }).lean();
}

async function findActive(id) {
  validateId(id);
  return Patient.findOne({ _id: id, active: true }).lean();
}

async function findById(id) {
  const patient = await findActive(id);
  if (!patient) throw new AppError(NOT_FOUND, 404);
  return patient;
}

async function update(id, changes) {
  validateId(id);
  const patient = await Patient.findOneAndUpdate(
    { _id: id, active: true },
    { $set: allowedChanges(changes) },
    { new: true, runValidators: true }
  ).lean();
  if (!patient) throw new AppError(NOT_FOUND, 404);
  return patient;
}

async function softDelete(id) {
  validateId(id);
  const patient = await Patient.findOneAndUpdate(
    { _id: id, active: true },
    { $set: { active: false, deletedAt: new Date() } },
    { new: true }
  ).lean();
  if (!patient) throw new AppError(NOT_FOUND, 404);
  return patient;
}

module.exports = { create, list, findActive, findById, update, softDelete };
