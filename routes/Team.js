const express = require('express');
const router = express.Router();
const team_controller = require('../controller/Team_controller');

router.get('/details', team_controller.team_details_handler);
router.post('/create', team_controller.team_create_handler);
router.post('/add', team_controller.team_add_handler);
router.delete('/delete/:id', team_controller.team_delete_handler);

module.exports = router