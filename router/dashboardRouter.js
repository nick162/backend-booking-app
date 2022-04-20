const express = require('express');
const DashboardController = require('../controller/DashboardController')
const auth = require('../middleware/auth')
const router = express.Router();

router.get('/read', DashboardController.viewDashboard)

module.exports = router;