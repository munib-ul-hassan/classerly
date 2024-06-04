const mongoose=require("mongoose");
const {Schema}=require("mongoose");

const lessonsSchema= mongoose.Schema({
    lessonName:{
        type:String,
        
    },
    lessonContent:{
        type:String
    },
    topicId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Topic"
    },


},{
    timestamps:true,
})

const LessonsModel=mongoose.model("Lessons",lessonsSchema);
module.exports=LessonsModel;
