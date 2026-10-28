const service = require('./appointments.service');

async function create(req, res) {
  const appointment = await service.create(req.body ?? {});
  res.status(201).json(appointment);
}

async function list(req, res) {
  const appointments = await service.list();
  res.json(appointments);
}

async function getById(req, res) {
  const appointment = await service.findById(req.params.id);
  res.json(appointment);
}

async function update(req, res) {
  const appointment = await service.update(req.params.id, req.body ?? {});
  res.json(appointment);
}

async function softDelete(req, res) {
  const appointment = await service.softDelete(req.params.id);
  res.json(appointment);
}

module.exports = { create, list, getById, update, softDelete };
