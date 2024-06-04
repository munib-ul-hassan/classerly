const express=require('express');
const app=express();
const cors=require('cors')
const cookieparser=require('cookie-parser')
const path = require('path');

app.use(express());
app.use(express.json({limit: "50mb"}))

app.use(express.urlencoded({extended:true}))
app.use(cookieparser())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//routes

const studentRoutes=require("./routes/Student.Routes/student.routes")
const userRoutes =require("./routes/AllusersRoutes/users.routes")
const subjectRoutes=require("./routes/subject.routes")
const parentRoutes=require("./routes/ParentRoutes/parent.routes")
const teacherRoutes= require('./routes/TeacherRoutes/teacher.routes')
const adminRoutes=require('./routes/AdminRoutes/adminroutes')

const gradeRoutes=require('./routes/grade.routes')
const authRoutes = require("./routes/auth.routes")
const uploadRoutes=require("./routes/upload.routes")
//declare
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1',uploadRoutes)
app.use('/api/v1/grade',gradeRoutes)
app.use('/api/v1/subject',subjectRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: 3600000 // Set cache expiry for 1 hour (optional)
  }));
app.use('/api/v1/student',studentRoutes)
app.use('/api/v1/user',userRoutes)
// app.use('/api/v1/curriculum',curriculumRoutes);
app.use('/api/v1/parent',parentRoutes);
app.use('/api/v1/teacher',teacherRoutes)
app.use('/api/v1/admin',adminRoutes)
module.exports=app;