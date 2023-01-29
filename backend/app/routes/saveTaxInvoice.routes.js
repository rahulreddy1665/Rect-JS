/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/save_taxInvoice.controller");

module.exports = function (app) {
  app.get("/api/save_taxInvoice", [authJwt.verifyToken], controller.findAll); //get all the tax_invoice data
  app.get(
    "/api/save_taxInvoice/:id",
    [authJwt.verifyToken],
    controller.findById
  ); //get all the tax_invoice data
  app.post("/api/save_taxInvoice", [authJwt.verifyToken], controller.add); //create new tax_invoice

  app.delete(
    "/api/save_taxInvoice/:value",
    [authJwt.verifyToken],
    controller.delete
  );
};
