const { Router } = require('express');
const controller = require('./doctors.controller');

const router = Router();

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.softDelete);

module.exports = router;
