const mongoose=require("mongoose");
const {Schema}=require("mongoose");

const lessonSchema=new Schema({
    lessontitle:String,
    subjectname:String,
    grade:String,
    topicname:String,
    content:String
},{
   timestamps:true
})

const lessonModel=mongoose.model('Lessons',lessonSchema);
module.exports=lessonModel;