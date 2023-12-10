/* ***********************
 * Require Statements
 *************************/
const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');
const invManagement = require('../utilities/inventory-management');
/* End of Require Statements */

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async (req, res, next) => {
  try {
    let classification_id = await req.params.classificationId;
    let data = await invModel.getInventoryByClassificationId(classification_id);
    let grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    let className = data[0].classification_name;
    res.render('./inventory/classification', {
      title: `${className} Vehicles`,
      nav,
      grid
    });
  } catch (Error) {
    let nav = await utilities.getNav();
    res.render("errors/error", {
      title: '500 Server Error',
      message: "Sorry, it appears the site is experiencing issues. Please try again later.",
      nav
    })
  }
}; /* End of Function: buildByClassificationId() */

/* ***************************
 *  Build inventory by single vehicle view
 * ************************** */
invCont.printSingleVehicle = async (req, res, next) => {
  try {
    let vehicle_id = await req.params.vehicleId;
    let data = await invModel.getSingleVehicleByVehicleId(vehicle_id);
    let vehicleInfo = await utilities.buildSingleVehicleInfo(data);
    let nav = await utilities.getNav();
    let vehicleName = `${data[0].inv_make} ${data[0].inv_model}`;
    res.render('./inventory/vehicle', {
      title: vehicleName,
      nav,
      vehicleInfo
    })
  } catch (Error) {
    let nav = await utilities.getNav();
    res.render('errors/error', {
      title: '500 Server Error',
      message: 'Sorry, it appears the site is experiencing issues. Please try again later.',
      nav
    })
  }
} /* End of Function: printSingleVehicle() */

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInventoryManagement = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render('inventory/management', {
      title: 'Vehicle Management',
      nav
    })
  } catch (Error) {
    res.render('errors/error', {
      title: '500 Server Error',
      message: 'Sorry, it appears the site is experiencing issues. Please try again later.',
      nav
    })
  }
} /* End of Function: buildInventoryManagement() */

/* ***************************
 *  Deliver "Add New Classification" view
 *  *** ONLY ACCESSIBLE BY ADMINS ***
 * ************************** */
invCont.buildAddNewClassView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      errors: null
    });
  } catch (error) {
    res.render('errors/error', {
      title: '500 Server Error',
      message: 'Sorry, it appears the site is experiencing issues. Please try again later.',
      nav
    });
  };
} /* End of Function: buildAddNewClassView() */

/* ***************************
 *  Insert a new classification into the DB,
 *  then go back to "Vehicle Management view",
 *  then add that classification to the nav
 *  *** ONLY ACCESSIBLE BY ADMINS ***
 * ************************** */
invCont.addNewClassificationController = async (req, res, next) => {
  try {
    // console.log('addNewClassificationController req.body');
    // console.log(req.body);
    const { classification_name } = req.body;
    const classificationResult = await invManagement.addNewClassificationToDB(classification_name);
    // console.log('classification_name');
    // console.log(classification_name);
    // console.log('classificationResult');
    // console.log(classificationResult);
    if (classificationResult) {
      let nav = await utilities.getNav();
      req.flash('success', `Congratulations! The new ${classification_name} classification was successfully created & added the navigation bar.`);
      res.status(201).render('inventory/management', {
        title: 'Vehicle Management',
        nav
      });
    };
  } catch (error) {
    let nav = await utilities.getNav();
    req.flash('error', 'Sorry, that classification could not be created. Please retry.');
    res.status(501).render('inventory/add-classification', {
      title: 'Add New Classification',
      nav
    })
  }
} /* End of Function: addNewClassificationController() */

/* ***************************
 *  Deliver "Add New Vehicle" view
 *  *** ONLY ACCESSIBLE BY ADMINS ***
 * ************************** */
invCont.buildAddNewVehicleView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav,
      options,
      errors: null
    });
  } catch (error) {
    res.render('errors/error', {
      title: '500 Server Error',
      message: 'Sorry, it appears the site is experiencing issues. Please try again later.',
      nav
    });
  };
} /* End of Function: buildAddNewVehicleView() */

/* ***************************
 *  Insert a new vehicle into the DB,
 *  then go back to "Vehicle Management view"
 *  *** ONLY ACCESSIBLE BY ADMINS ***
 * ************************** */
invCont.addNewVehicleController = async (req, res, next) => {
  try {
  let nav = await utilities.getNav();

  console.log('addNewVehicleController req.body');
  console.log(req.body);

  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

  const vehicleResult = await invManagement.addNewVehicleToDB(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);

  console.log('vehicleResult:');
  console.log(vehicleResult);
  if (vehicleResult) {
    req.flash('success', `Congratulations! The new ${inv_year} ${inv_make} ${inv_model} was successfully created!`);
    res.status(201).render('inventory/management', {
      title: 'Vehicle Management',
      nav
    });
  };
  } catch (error) {
    req.flash('error', 'Sorry, that vehicle could not be created. Please retry.');
    res.status(501).render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav
    })
  }
} /* End of Function: addNewVehicleController() */

module.exports = invCont;
