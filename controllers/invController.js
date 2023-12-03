const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async (req, res, next) => {
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
};

/* ***************************
 *  Build inventory by single vehicle view
 * ************************** */
invCont.printSingleVehicle = async (req, res, next) => {
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
}

module.exports = invCont;
