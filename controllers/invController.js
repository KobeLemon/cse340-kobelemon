/* ***********************
 * Require Statements
 *************************/
const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');
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
      message: "Sorry, it appears the site has crashed.",
      nav
    })
  }
};
/* End of Function: buildByClassificationId() */

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
    res.render("errors/error", {
      title: '500 Server Error',
      message: "Sorry, it appears the site has crashed.",
      nav
    })
  }
}
/* End of Function: printSingleVehicle() */

module.exports = invCont;
