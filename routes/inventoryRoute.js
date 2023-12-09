/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');
const regValidate = require('../utilities/inventory-management');
/* End of Require Statements */

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// Route to get a vehicle by its vehicle_id
router.get('/vehicle/:vehicleId', utilities.handleErrors(invController.printSingleVehicle));

// Route to show the inventory management view
router.get('/', utilities.handleErrors(invController.buildInventoryManagement));

// Route to show the "Add New Classification" view
router.get('/add-classification', utilities.handleErrors(invController.buildAddNewClassView));

// Route to post the new classification to the database
router.post('/add-classification',
  regValidate.newClassificationRules(),
  regValidate.checkNewClassificationData,
  utilities.handleErrors(invController.addNewClassificationController)
);

// Route to show the "Add New Vehicle" view
// router.get('add-vehicle', utilities.handleErrors(invController.addNewVehicle));

// Route to post the new vehicle to the database
// router.post('add-vehicle',
//   regValidate.newVehicleRules(),
//   regValidate.checkNewVehicleData,
//   utilities.handleErrors(invController.addNewVehicleController)
// );

module.exports = router;
