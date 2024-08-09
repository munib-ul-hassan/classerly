
const nodemailer=require('nodemailer');


const sendEmail=(async(emailsubject,email,message,requestType)=>{
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
            subject:`${emailsubject}`,
            body:"resetPassword OTP",
            html:`
            <div style="font-family: Arial, sans-serif; padding: 7px;">
            <div style="font-family:Monospace; background-color:#77f571; text-align: center; padding: 20px;border-radius:5px">
         <h2 style="">Learning Portal Classerly</h2>
          </div>
            <p style="color: #666;">Dear User,</p>
            <p style="color: #666;">${requestType}</p>
            <div style="text:center">
                <p style="padding: 5px;background-color: #fff;color: #333;  margin: 0; width: 90% ;">${message}</p>
            </div>
            
            <p style="color: #666;">If you did not request this, you can ignore this email.</p>
            <p style="color: #666;">Regards,<br/>Team,<br/>Learning Portal Classerly</p>
        </div>
        `
        }
        await transporter.sendMail(Mailoptions)
    } catch (error) {
        console.log("something went wrong in sending email", error.message)
    // throw new ApiError(500,"something went wrong in sending email")
    }


})

module.exports=sendEmail;