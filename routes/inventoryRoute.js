/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');
/* End of Require Statements */

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));
router.get('/vehicle/:vehicleId', utilities.handleErrors(invController.printSingleVehicle));

module.exports = router;
