const {Router}=require('express');
const { registerparent, getDtailofParentChilds, addNewChild, getMyChilds } = require("../../controllers/ParentControllers/parent.controllers");



const router=Router();


// ###################### Parents Routes #########################
router.route('/registerParent').post(registerparent);
router.route('/add-my-other-child/:id').post(addNewChild);
router.route('/get-my-childs/:id').get(getMyChilds);
router.route('/get-child-detail/:id').get(getDtailofParentChilds);
module.exports=router;