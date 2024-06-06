const { Router } = require('express');
const { userlogin, userlogout, userforgetPassword, verifyOtp, resetPassword } = require('../controllers/allUsers');
const verfiyJWT = require('../middlewares/auth.middleware');

const router=Router();


// ########################### all users Routes ##############################
router.route("/userlogin").post(userlogin)
router.route("/userlogout").post(verfiyJWT,userlogout)
router.route("/forgetuserPassword").post(userforgetPassword)
router.route("/VerifyOtp").post(verifyOtp)
router.route("/resetpassword").post(resetPassword)

module.exports=router;