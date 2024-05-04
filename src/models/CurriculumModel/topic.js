const mongoose=require("mongoose");
const {Schema}=require("mongoose");


// ######################## Topic Schema #####################
const TopicSchema=new Schema({
     topicname:String,
     grade:String,
     subjectname:String,

},{
     timestamps:true,
})

const topicModel=mongoose.model("SubjectTopics",TopicSchema);
module.exports=topicModel;