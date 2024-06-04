// const mongoose=require('mongoose');
// const {Schema}=require('mongoose');
// const bcrypt=require('bcrypt');
// const jwt=require('jsonwebtoken');

// // ############## student Schema ######################
// const StudentSchema=new Schema({
//     fullname:{
//         type:String,
//         required:true,
//         trim:true,
//         index:true,
        
//     },
//     username:{
//         type:String,
//         required:true,
//         trim:true,
//         index:true,
//         unique:true
//     },
//     password:{
//           type:String,
//           required:[true,'Password is required']
//     },
//     stdid:{
//         type:String,
//     },
//     role:{
//        type:String,
//        default: 'student'
//     }, 
//     gradeName:{
//         type:String
//     }, 
//     studentSubjects : [{
        
//             type : mongoose.Schema.Types.ObjectId,
//             ref : "subject"
        
//     }],
//     studentTeachers:[{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Teacher"
//     }],
//     emailaddress:{
//          type:String,
//          required:true,
         
//     },
//     gradeId:{
//         type:Schema.Types.ObjectId,
//         ref : "Grade"
//     },
//     fulladdress:{
//         type:String,
//         required:true
//     },
//     forgetPasswordOtp:{
//         type:Number
//     },
//     forgetPasswordOtpExpiry:{
//         type:Number
//     }
// },{
//     timestamps:true
// }
// )

// StudentSchema.pre("save",async function (next){
    

//     if(this.isModified("password")){
//         this.password=await bcrypt.hash(this.password,10);
//         next();
//     }
   
// })
//  StudentSchema.methods.isPasswordCorrect=async function
//  (password){
//     return await bcrypt.compare(password,this.password)
//  }
//  StudentSchema.methods.generateAccessToken= function(){
//   return  jwt.sign({
//         _id:this._id,
//         emailaddress:this.emailaddress,
//         fullname:this.fullname,
//         username:this.username,
//         role:this.role
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//         expiresIn:process.env.ACCESS_TOKEN_EXPIRY
//     }
// )
// }
// StudentSchema.methods.generateRefreshToken=function(){
//   return  jwt.sign({
//         _id:this._id,
//         role:this.role

//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
//     }
// )
// }

// const StudentModel=mongoose.model('student',StudentSchema)
// module.exports=StudentModel;