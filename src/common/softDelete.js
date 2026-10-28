// Baja lógica compartida por todas las colecciones.
// Campos: active (true por defecto) y deletedAt (null mientras esté activo).
// El plugin bloquea cualquier borrado físico desde Mongoose, de modo
// que la única forma de "eliminar" un documento es darlo de baja.
const AppError = require('./AppError');

const softDeleteFields = {
  active: { type: Boolean, default: true, index: true },
  deletedAt: { type: Date, default: null },
};

function blockPhysicalDelete(schema) {
  const reject = () => {
    throw new AppError('Physical delete is not allowed; use soft delete', 400);
  };
  schema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete'], { document: false, query: true }, reject);
  schema.pre('deleteOne', { document: true, query: false }, reject);
}

module.exports = { softDeleteFields, blockPhysicalDelete };
