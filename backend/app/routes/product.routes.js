/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/product.controller");

module.exports = function (app) {
  app.get("/api/product", [authJwt.verifyToken], controller.findAll); //get all the product data
  app.get("/api/product/:id", [authJwt.verifyToken], controller.findById); //get all the product data
  app.get(
    "/api/product_name/:id",
    [authJwt.verifyToken],
    controller.findByName
  ); //get all the product name wise data
  app.post("/api/product", [authJwt.verifyToken], controller.add); //create new product
  app.patch("/api/product", [authJwt.verifyToken], controller.update); //update product data
  app.delete("/api/product/:value", [authJwt.verifyToken], controller.delete); //delete product
};
