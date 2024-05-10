const mongoose=require("mongoose");

const {Schema}=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

// ################## Parent Schema ##########################
const parentSchema=new Schema({
    fullname:{
    type:String,
    required:true,
    trim:true,
    index:true,
    
},
username:{
    type:String,
    required:true,
    trim:true,
    index:true,
    unique:true
},
password:{
      type:String,
      required:[true,'Password is required']
},
role:{
   type:String,
   default: 'parent'
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
childIds: [{
    type: Schema.Types.ObjectId,
    ref: 'students' 
}],
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
parentSchema.pre("save",async function (next){
   if(this.isModified("password")){
       this.password=await bcrypt.hash(this.password,10);
       next();
   }
  
})
parentSchema.methods.isPasswordCorrect=async function
(password){
   return await bcrypt.compare(password,this.password)
}
parentSchema.methods.generateAccessToken= function(){
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
parentSchema.methods.generateRefreshToken=function(){
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

const ParentModel=mongoose.model('parent',parentSchema);
module.exports= ParentModel;