const {Router}=require('express');
const { addNewChild, getMyChilds ,addfeedback, updatefeedback,myFeedBacks} = require("../controllers/parent.controllers");
const { verifytoken, verifyparenttoken } = require('../middlewares/auth');



const router=Router();


// ###################### Parents Routes #########################
// router.route('/registerParent').post(registerparent);
router.route('/addchild').post(verifytoken,addNewChild);
router.route('/parent/feedback').post(verifyparenttoken,addfeedback);
router.route('/parent/feedback/:id').put(verifyparenttoken,updatefeedback);

router.route('/parent/feedback').get(verifyparenttoken,myFeedBacks);

router.route('/mychilds').get(verifytoken,getMyChilds);



module.exports=router;