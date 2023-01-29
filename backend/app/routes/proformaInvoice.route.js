/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/proforma_invoice.controller");

module.exports = function (app) {
  app.get("/api/proforma_invoice", [authJwt.verifyToken], controller.findAll); //get all the tax_invoice data
  app.get(
    "/api/proforma_invoice/:id",
    [authJwt.verifyToken],
    controller.findById
  ); //get all the tax_invoice data
  app.post("/api/proforma_invoice", [authJwt.verifyToken], controller.add); //create new tax_invoice
  app.delete(
    "/api/proforma_invoice/:id",
    [authJwt.verifyToken],
    controller.delete
  );
};
