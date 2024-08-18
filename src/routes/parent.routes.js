const {Router}=require('express');
const { addNewChild, getMyChilds ,addfeedback, updatefeedback,myFeedBacks,getQuizInfo} = require("../controllers/parent.controllers");
const { verifytoken, verifyparenttoken } = require('../middlewares/auth');



const router=Router();


// ###################### Parents Routes #########################
// router.route('/registerParent').post(registerparent);
router.route('/addchild').post(verifytoken,addNewChild);


router.route('/parent/feedback/:id').get(verifyparenttoken,myFeedBacks);

router.route('/mychilds').get(verifytoken,getMyChilds);

router.route("/getquizinfo/:id").get(verifytoken,getQuizInfo);




module.exports=router;