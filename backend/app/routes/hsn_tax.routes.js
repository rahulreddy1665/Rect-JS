/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/hsn_tax.controller");

module.exports = function (app) {
  app.get("/api/hsn_tax", [authJwt.verifyToken], controller.findAll); //get all the hsn_tax data
  app.get("/api/hsn_tax/:id", [authJwt.verifyToken], controller.findById); //get all the hsn_tax data
  app.get(
    "/api/hsn_tax_name/:id",
    [authJwt.verifyToken],
    controller.findByName
  ); //get all the hsn_tax name wise data
  app.post("/api/hsn_tax", [authJwt.verifyToken], controller.add); //create new hsn_tax
  app.patch("/api/hsn_tax", [authJwt.verifyToken], controller.update); //update hsn_tax data
  app.delete("/api/hsn_tax/:value", [authJwt.verifyToken], controller.delete); //delete hsn_tax

  app.get("/api/accounting", [authJwt.verifyToken], controller.findOneA);
  app.post("/api/accounting", [authJwt.verifyToken], controller.createA);
};
