const mongoose=require('mongoose');
const {Schema}=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const StudentSchema=new Schema({
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
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
    rollno:{
        type:String,
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
    refreshtoken:{
        type:String
    }


},{
    timestamps:true
}
)

StudentSchema.pre("save",async function (next){
     if(this.isNew && !this.rollno){
        const lastStudent= await StudentModel.findOne({},{},{sort:{rollno:-1}});
        let rollNosuffix=1;
        if(lastStudent && lastStudent.rollno){
            const lastRollno=lastStudent.rollno.slice(-1);
            rollNosuffix=parseInt(lastRollno)+1;
        }
        this.rollno=`S2324${rollNosuffix}`

     }
       
     

    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        next();
    }
   
})
 StudentSchema.methods.generateAccessToken=function(){
  return  jwt.sign({
        _id:this._id,
        email:this.email,
        fullname:this.fullname,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
StudentSchema.methods.generateRefreshToken=function(){
  return  jwt.sign({
        _id:this._id,
        email:this.email,
       
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

const StudentModel=mongoose.model('students',StudentSchema)
module.exports=StudentModel;