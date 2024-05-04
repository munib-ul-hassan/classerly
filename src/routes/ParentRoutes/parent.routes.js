const {Router}=require('express');
const { registerparent } = require("../../controllers/ParentControllers/parent.controllers");



const router=Router();



router.route('/registerParent').post(registerparent);

module.exports=router;