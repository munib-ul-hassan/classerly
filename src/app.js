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

const studentRoutes=require("./routes/StudentRoutes/student.routes")
const userRoutes =require("./routes/AllusersRoutes/users.routes")
const curriculumRoutes=require("./routes/CurriculumRoutes/curriculum.routes")
const parentRoutes=require("./routes/ParentRoutes/parent.routes")
//declare
app.use('/api/v1/student',studentRoutes)
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/curriculum',curriculumRoutes);
app.use('/api/v1/parent',parentRoutes);

module.exports=app;