/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.get("/api/user_one", [authJwt.verifyToken], controller.findById); //get only one user
  app.get("/api/user_count", [authJwt.verifyToken], controller.findTotalUser); //For get login user data
  app.get("/api/user", controller.userAll); //get all the user
  app.post("/api/user", [authJwt.verifyToken], controller.add); //ading new user data
  app.post("/api/user_mobile", controller.createUser); //add user from mobile app
  app.post("/api/user_block", controller.block); //user block unblock
  app.patch("/api/user", [authJwt.verifyToken], controller.update); //update user data
  app.delete("/api/user/:id", [authJwt.verifyToken], controller.delete); //delete the user data
  app.post(
    "/api/update_password",
    [authJwt.verifyToken],
    controller.UpdatePassword
  ); //for update user data
  app.post("/api/user_bulk", controller.user_bulk); //new user bulk import this will be add only for adding old data
  app.post("/api/password_reset", controller.password_reset); //password reset for mobile app
  app.post("/api/user_phone", controller.user_phone); //check user already register from mobile
  app.post("/api/resend_otp", controller.resendOtp); //for resend otp verify
  app.post("/api/otp_verify", controller.optVerify); //verify otp value
};
