const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {Schema}=require('mongoose');
 
// ########################## Teacher Schema #################################

const teacherSchema=new Schema({
    fullname:{
    type:String,
    required:true,
    trim:true,
  
    
},
username:{
    type:String,
    required:true,
    trim:true,
    unique:true
},
teachersSubjects : [{
    subjectId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "subject"
    }
}],
password:{
      type:String,
      required:[true,'Password is required']
},
emailaddress:{
     type:String,
     required:true,
     unique:true
},
fulladdress:{
    type:String,
    required:true
},
role:{
    type:String,
    default: 'teacher'
 },
 feedback:{
    type:[String]
 },
refreshToken:{
    type:String
},
forgetPasswordOtp:{
    type:Number
},
forgetPasswordOtpExpiry:{
    type:Number
}
},{
timestamps:true
})
teacherSchema.pre("save",async function (next){
   if(this.isModified("password")){
       this.password=await bcrypt.hash(this.password,10);
       next();
   }
})
teacherSchema.methods.isPasswordCorrect=async function
(password){
   return await bcrypt.compare(password,this.password)
}
teacherSchema.methods.generateAccessToken= function(){
 return  jwt.sign({
       _id:this._id,
       emailaddress:this.emailaddress,
       fullname:this.fullname,
       username:this.username,
       role:this.role
   },
   process.env.ACCESS_TOKEN_SECRET,
   {
       expiresIn:process.env.ACCESS_TOKEN_EXPIRY
   }
)
}
teacherSchema.methods.generateRefreshToken=function(){
 return  jwt.sign({
       _id:this._id,
       role:this.role

   },
   process.env.REFRESH_TOKEN_SECRET,
   {
       expiresIn:process.env.REFRESH_TOKEN_EXPIRY
   }
)
}

const TeacherModel=mongoose.model('Teacher',teacherSchema);
module.exports=TeacherModel;