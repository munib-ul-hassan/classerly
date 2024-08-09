const express = require("express");
const app = express();
const cors = require("cors");
const cookieparser = require("cookie-parser");
const path = require("path");

app.use(express());
app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//routes

app.get("",(req,res)=>{
  res.send("Welcome to classerly")
})
const subjectRoutes = require("./routes/subject.routes");
const parentRoutes = require("./routes/parent.routes");
const teacherRoutes = require("./routes/teacher.routes");
const adminRoutes = require("./routes/admin.routes");

const gradeRoutes = require("./routes/grade.routes");
const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const topicRoutes = require("./routes/topic.routes");

const quizRoutes = require("./routes/quiz.routes")
// const adddata = require("./utils/adddummydata");

//declare
// adddata();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api/v1/grade", gradeRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/topic", topicRoutes);
app.use("/api/v1", parentRoutes);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: 3600000, // Set cache expiry for 1 hour (optional)
  })
);


// app.use('/api/v1/curriculum',curriculumRoutes);
app.use("/api/v1/teacher", teacherRoutes);
app.use("/api/v1/quiz", quizRoutes);


app.use("/api/v1/admin", adminRoutes);
module.exports = app;
