const service = require('./doctors.service');

async function create(req, res) {
  const doctor = await service.create(req.body ?? {});
  res.status(201).json(doctor);
}

async function list(req, res) {
  const doctors = await service.list();
  res.json(doctors);
}

async function getById(req, res) {
  const doctor = await service.findById(req.params.id);
  res.json(doctor);
}

async function update(req, res) {
  const doctor = await service.update(req.params.id, req.body ?? {});
  res.json(doctor);
}

async function softDelete(req, res) {
  const doctor = await service.softDelete(req.params.id);
  res.json(doctor);
}

module.exports = { create, list, getById, update, softDelete };
