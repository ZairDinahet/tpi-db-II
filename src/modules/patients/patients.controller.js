const service = require('./patients.service');

async function create(req, res) {
  const patient = await service.create(req.body ?? {});
  res.status(201).json(patient);
}

async function list(req, res) {
  const patients = await service.list();
  res.json(patients);
}

async function getById(req, res) {
  const patient = await service.findById(req.params.id);
  res.json(patient);
}

async function update(req, res) {
  const patient = await service.update(req.params.id, req.body ?? {});
  res.json(patient);
}

async function softDelete(req, res) {
  const patient = await service.softDelete(req.params.id);
  res.json(patient);
}

module.exports = { create, list, getById, update, softDelete };
