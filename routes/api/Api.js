const express = require('express');
const router = express.Router();
const api_controller = require('../../controller/Api_controller');

router.post('/update', api_controller.update_professional_handler);

module.exports = router