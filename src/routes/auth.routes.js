const { Router } = require('express');
const { register, login, forgotpassword, verifyuser, resetpassword, updateuser } = require('../controllers/auth.controller');


const router=Router();
router.post("/register",register)
router.post("/login",login)

router.post("/forgotpassord",forgotpassword)
router.post("/verify",verifyuser)
router.post("/restepassword",resetpassword)
router.post("/updateuser",updateuser)




module.exports=router;
