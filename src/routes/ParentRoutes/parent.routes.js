const {Router}=require('express');
const { registerparent } = require("../../controllers/ParentControllers/parent.controllers");



const router=Router();


// ###################### Parents Routes #########################
router.route('/registerParent').post(registerparent);

module.exports=router;