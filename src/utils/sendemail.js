
const nodemailer=require('nodemailer');
const ApiError = require('./Apierror');

const sendEmail=(async(email,otp)=>{
    console.log("email body",email);
    try {
        const transporter=nodemailer.createTransport({
            service:"Gmail",
            port:587,
            secure:false,
            auth:{
                user:process.env.SMTP_EMAIL,
                pass:process.env.SMTP_PASSWORD
            }
        })
        
        const Mailoptions={
            from:process.env.SMTP_EMAIL,
            to:email,
            subject:"resetPassword OTP",
            body:"resetPassword OTP",
            html:`<h2>${otp}</h2>`
        }
        await transporter.sendMail(Mailoptions)
    } catch (error) {
    throw new ApiError(500,"something went wrong in sedning email")
    }


})

module.exports=sendEmail;