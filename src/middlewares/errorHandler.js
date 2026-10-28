function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    const detail = field ? ` (${field})` : '';
    return res.status(409).json({ error: `A document with that unique value already exists${detail}` });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal error' });
}

module.exports = errorHandler;
