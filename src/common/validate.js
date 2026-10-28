const mongoose = require('mongoose');
const AppError = require('./AppError');

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(`Invalid id: ${id}`, 400);
  }
}

// active y deletedAt solo los modifica la baja lógica.
function allowedChanges(changes) {
  const { active, deletedAt, ...allowed } = changes ?? {};
  return allowed;
}

module.exports = { validateId, allowedChanges };
