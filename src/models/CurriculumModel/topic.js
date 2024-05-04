const mongoose=require("mongoose");
const {Schema}=require("mongoose");


// ######################## Topic Schema #####################
const TopicSchema=new Schema({
     topicname:String,
     lessons : [{
          lessonName : {
               type : String
          },
          lessonContent : {
               type : String
          },
          lessonPic : {
               type : String
          }
     }]
},{
     timestamps:true,
})

const topicModel=mongoose.model("Topic",TopicSchema);
module.exports=topicModel;