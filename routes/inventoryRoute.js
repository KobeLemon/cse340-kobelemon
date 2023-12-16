//* routes/inventoryRoute.js

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');
const invValidate = require('../utilities/inventory-validation');
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
  invValidate.newClassificationRules(),
  invValidate.checkNewClassificationData,
  utilities.handleErrors(invController.addNewClassificationController)
);

// Route to show the "Add New Vehicle" view
router.get('/add-inventory', utilities.handleErrors(invController.buildAddNewVehicleView));

// Route to post the new vehicle to the database
router.post('/add-inventory',
  invValidate.newVehicleRules(),
  invValidate.checkNewVehicleData,
  utilities.handleErrors(invController.addNewVehicleController)
);

// Route to get inventory by classification_id for admin vehicle modification
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON));

module.exports = router;
