const lessonModel = require("../../models/CurriculumModel/lesson");
const subjectModel = require("../../models/CurriculumModel/subject");
const topicModel = require("../../models/CurriculumModel/topic");

const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/Apierror");
const asyncHandler = require("../../utils/asyncHandler");


exports.addsubjects = asyncHandler(async (req, res) => {
    try {
        const { subjectname, grade } = req.body;
        if ([subjectname, grade].some((field) => field?.trim() === "")) {
            throw new ApiError(400, 'All fields are required');
        }

        const existingSubject = await subjectModel.findOne({ subjectname, grade });

        if (existingSubject) {
            throw new ApiError(400, "Subject name already exists in this grade");
        }

        const subject = new subjectModel({
            grade: grade,
            subjectname: subjectname,
        });
        await subject.save();
        res.status(201).json(new ApiResponse(200, "Subject created"));
    } catch (error) {
       
        const errorMessage = error.message || "Something went wrong";
        return res.status(500).json(new ApiResponse(500, errorMessage));
    }
});


exports.addTopic = asyncHandler(async(req, res) => {
    try {
        const { subjectname, topicname, grade } = req.body;
        console.log(req.body);
        if(
            [subjectname,topicname,grade,grade].some((feild)=>
                feild?.trim()===""
            )
         ){
            throw new ApiError(400,'All fields are required')
         }
       

        if (!grade) {
            throw new Error("Please enter grade");
        }

        const subjectExist = await subjectModel.findOne({subjectname,grade });
        console.log(subjectExist);

        if (!subjectExist) {
            throw new Error("Subject does not exist. You need to add subject first");
        }

        const topicExist = await topicModel.findOne({ subjectname, grade, topicname });

        if (topicExist) {
            throw new Error("Topic already exists. Please change the name or add another one.");
        }

        const addTopic = new topicModel({
            topicname: topicname,
            grade: grade,
            subjectname: subjectname
        });

        await addTopic.save();
        res.status(201).json(new ApiResponse(200,addTopic, "Topic added successfully"));
    } catch (error) {
        const errorMessage = error.message || "Something went wrong";
        return res.status(500).json(new ApiResponse(500, errorMessage));
    }
});

exports.addlesson=asyncHandler(async(req,res)=>{
    try {
        
            const { lessontitle,subjectname,grade,topicname,content}=req.body;
            console.log(req.body);
            if(
                [lessontitle,subjectname,topicname,grade,content].some((feild)=>
                    feild?.trim()===""
                )
             ){
                throw new Error('All fields are required')
             }
    
             const subjectexist=await subjectModel.findOne({subjectname,grade})
             console.log(subjectexist)
             if(!subjectexist){
                throw new Error("subject not exist you need to create subject first")
             }
            const topicexist=await topicModel.findOne({topicname});
            if(!topicexist){
                throw new Error("Topic not Exist")
            }
            const lessonexist=await lessonModel.findOne({lessontitle,content});
            if(lessonexist){
                throw new Error("Lesson Already exist")
            }
    
            const createdlesson=new lessonModel({
                lessontitle,
                subjectname,
                grade,
                topicname,
                content
            })
           await createdlesson.save()
             res.status(201).json(
               new ApiResponse(200,createdlesson,"lesson created succesfuly")
             )
    } catch (error) {
        const errorMessage = error.message || "Something went wrong";
        return res.status(500).json(new ApiResponse(500, errorMessage));
        
    }
    }
)

exports.allsubjects = asyncHandler(async(req, res) => {
    try {
        const { grade } = req.body;
        console.log(req.body);
        
        const allsubjectsofgrade = await subjectModel.find({ grade });
        console.log(allsubjectsofgrade);

        if (!allsubjectsofgrade || allsubjectsofgrade.length === 0) {
            throw new Error(`Subjects do not exist for grade: ${grade}`);
        }
        
        res.status(201).json(
            new ApiResponse(200, allsubjectsofgrade, `All subjects of grade: ${grade}`)
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong");
    }
});


exports.alltopicsofsubject = asyncHandler(async(req, res) => {
    try {
        const { subjectname, grade } = req.body;
        console.log(req.body);
        
        const alltopicsofsubject = await topicModel.find({ subjectname, grade });
        console.log(alltopicsofsubject);

        if (!alltopicsofsubject || alltopicsofsubject.length === 0) {
            throw new Error("No topics exist for this subject and grade");
        }

        res.status(201).json(
            new ApiResponse(200, alltopicsofsubject, "All topics of that subject")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong");
    }
});


exports.allLessonsoftopics = asyncHandler(async (req, res) => {
    try {
        const { subjectname, grade, topicname } = req.body;

        // Check if required fields are missing or empty
        if (!subjectname || !grade || !topicname) {
            throw new Error("subjectname, grade, and topicname are required fields");
        }

        const allLessons = await lessonModel.find({ subjectname, grade, topicname });

        if (!allLessons || allLessons.length === 0) {
            throw new Error("No lessons exist for that topic");
        }

        res.status(201).json(
            new ApiResponse(200, allLessons, "All Lessons of that topic")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong");
    }
});
