/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/tax_invoice.controller");

module.exports = function (app) {
  app.get("/api/tax_invoice", [authJwt.verifyToken], controller.findAll); //get all the tax_invoice data
  app.get("/api/tax_invoice/:id", [authJwt.verifyToken], controller.findById); //get all the tax_invoice data
  app.post("/api/tax_invoice", [authJwt.verifyToken], controller.add); //create new tax_invoice
  app.patch("/api/tax_invoice", [authJwt.verifyToken], controller.update); //create new tax_invoice
  app.get(
    "/api/tax_invoice_payment/:id",
    [authJwt.verifyToken],
    controller.findAllPayments
  ); //get all the tax_invoice data

  app.post(
    "/api/tax_invoice_payment",
    [authJwt.verifyToken],
    controller.createPayment
  ); //get all the tax_invoice data

  app.get("/api/tax_invoice10", [authJwt.verifyToken], controller.findAll10);
  app.post("/api/tax_value_update", controller.tax_value_update);
  app.delete("/api/tax_invoice/:id", [authJwt.verifyToken], controller.delete);
};
