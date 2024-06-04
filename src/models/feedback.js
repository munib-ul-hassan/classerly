const mongoose=require('mongoose');
const { schema } = require('./StudentModel/student');

const {Schema}=require(mongoose);

const FeedbackSchema=new Schema({
    feedbackby:{
        type:Schema.Types.ObjectId,
        ref : "Parent"
    },
    feedbackto:{
        type:string
    },
    feedback:{
           type:String
    }
})

const FeedbackModel=mongoose.model("feedback",FeedbackSchema);
module.exports=FeedbackModel;