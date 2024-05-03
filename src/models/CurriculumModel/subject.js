const mongoose=require("mongoose");
const {Schema}=require('mongoose');


const subjectSchema=new Schema({
    subjectname:String,
    grade:String,
},{
    timestamps:true
    })

const subjectModel=mongoose.model("subject",subjectSchema);
module.exports=subjectModel;