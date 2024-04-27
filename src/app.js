const express=require('express');
const app=express();
const cors=require('cors')
const cookieparser=require('cookie-parser')

app.use(express());
app.use(express.json({limit: "50mb"}))

app.use(express.urlencoded({extended:true}))
app.use(cookieparser())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//routes
const studentRouter = require('./routes/student.routes.js');



//declare
app.use('/api/v1/student',studentRouter)

module.exports=app;