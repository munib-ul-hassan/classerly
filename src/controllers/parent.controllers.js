const { json } = require("express");
const ParentModel = require("../models/parent");
const StudentModel = require("../models/student");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendemail");
const { isValidObjectId, default: mongoose } = require("mongoose");
// const ApiError = require("../utils/Apierror");
const teacherModel = require("../models/teacher");
const FeedbackModel = require("../models/feedback");
const StudentquizesModel = require("../models/studentquizes");
const studentModel = require("../models/student");
const NotificationModel = require("../models/notification");
const topicModel = require("../models/topic");

exports.addNewChild = asyncHandler(async (req, res) => {
  const { stdid } = req.body;
  //   if (!isValidObjectId(parentId)) {
  //     return res.status(200).json({ message: "Invalid parent ID format" });
  //   }
  try {
    const findParent = await ParentModel.findById({
      _id: req.user.profile._id,
    });
    const child = await StudentModel.findOne({ code: stdid });

    if (!child) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid child Code" });
    }
    if (findParent.childIds.includes(child._id)) {
      return res
        .status(200)
        .json({ success: false, message: "Child Already added" });
    }

    findParent.childIds.push(child._id);
    findParent.save();
    await StudentModel.findOneAndUpdate(
      { code: stdid },
      { parent: findParent._id }
    );
    res
      .status(200)
      .json(new ApiResponse(200, findParent, "child added successfully"));
  } catch (error) {
    

    res.status(200).json({ message: error.message });
  }
});

exports.getMyChilds = asyncHandler(async (req, res) => {
  try {
    const findMychilds = await ParentModel.findOne({
      _id: req.user?.profile?._id,
    })
      .populate({
        path: "childIds",
        select: "-password",
        populate: {
          path: "grade",
          select: "grade",
          // populate: { path: "subjects", select: ["image", "name"] },
        },
      })
      .populate({
        path: "childIds",
        select: "-password",
        populate: { path: "subjects", select: ["image", "name"] },
      })
      .populate({
        path: "childIds",
        select: "-password",
        populate: { path: "auth", select: "-password" },
      });

    // const findMychilds = await ParentModel.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(req.user?.profile?._id),
    //     },
    //   },
    //   {
    //     $unwind: "$childIds",
    //   },
    //   {
    //     $lookup:{
    //       from:"students",
    //       foreignField:"_id",
    //       localField:"childIds",
    //       as:"childern"
    //     }
    //   },
    //   {
    //     $unwind: "$childern",
    //   },
    //   {
    //     $lookup: {
    //       from: "grades",
    //       // foreignField:"_id",
    //       // localField:"childern.grade",
    //       let: { childid: { $toString: "$childern.grade" } }, // Convert _id to string
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $eq: [{ $toString: "$_id"}, "$$childid"], // Convert topic field to string and compare
    //             },
    //           },
    //         },
    //       ],
    //       as: "grade",
    //     },
    //   },
    // ]);

    setTimeout(async () => {
      let childs = findMychilds.childIds;
      // let d =await Promise.all( childs.map(async (i) => {
      //   return {
      //     ...i._doc,subjects:
      //     await Promise.all(
      //       i.subjects.map(async (j) => {
      //         let quiz = await topicModel.aggregate([
      //           {
      //             $match: {
      //               subject: new mongoose.Types.ObjectId(j._id),
      //             },
      //           },
      //           {
      //             $lookup: {
      //               from: "lessons",
      //               let: { topicId: { $toString: "$_id" } }, // Convert _id to string
      //               pipeline: [
      //                 {
      //                   $match: {
      //                     $expr: {
      //                       $eq: [{ $toString: "$topic" }, "$$topicId"], // Convert topic field to string and compare
      //                     },
      //                   },
      //                 },
      //               ],
      //               as: "lessons",
      //             },
      //           },
      //           // {
      //           //   $match:{
      //           //     "lessons.readyby":{$in:[new mongoose.Types.ObjectId(req.user.profile._id)]}
      //           //   }
      //           // },
      //           {
      //             $lookup: {
      //               from: "quizes",
      //               let: { topicId: { $toString: "$_id" } }, // Convert _id to string
      //               pipeline: [
      //                 {
      //                   $match: {
      //                     $expr: {
      //                       $eq: [{ $toString: "$topic" }, "$$topicId"], // Convert topic field to string and compare
      //                     },
      //                   },
      //                 },
      //               ],
      //               as: "quizes",
      //             },
      //           },
      //           {
      //             $unwind: {
      //               path: "$quizes", // Specify the field you want to unwind
      //               preserveNullAndEmptyArrays: true,
      //             },
      //           },

      //           {
      //             $lookup: {
      //               from: "studentquizes",
      //               let: {
      //                 topicId: { $toString: "$quizes._id" },
      //                 stdId: { $toString: i?._id },
      //               }, // Convert _id to string
      //               pipeline: [
      //                 {
      //                   $match: {
      //                     $expr: {
      //                       $and: [
      //                         {
      //                           $eq: [{ $toString: "$quiz" }, "$$topicId"], // Convert topic field to string and compare
      //                         },
      //                         {
      //                           $eq: [{ $toString: "$student" }, "$$stdId"], // Convert topic field to string and compare
      //                         },
      //                       ],
      //                     },
      //                   },
      //                 },
      //               ],
      //               as: "studentquizes",
      //             },
      //           },
      //           {
      //             $group: {
      //               _id: "$_id",
      //               name: { $first: "$name" },

      //               image: { $first: "$image" },

      //               subject: { $first: "$subject" },
      //               difficulty: { $first: "$difficulty" },
      //               type: { $first: "$type" },
      //               lessons: { $first: "$lessons" },

      //               // Group by topic ID
      //               // subject: { $first: "$subject" }, // Keep other fields from the original topic
      //               // name: { $first: "$name" },
      //               quizes: {
      //                 $push: {
      //                   _id: "$quizes._id", // Keep quiz fields
      //                   title: "$quizes.createdBy",
      //                   questions: "$quizes.questions",
      //                   status: "$quizes.status",
      //                   grade: "$quizes.grade",
      //                   topic: "$quizes.topic",
      //                   subject: "$quizes.subject",
      //                   image: "$quizes.image",
      //                   endsAt: "$quizes.endsAt",
      //                   startsAt: "$quizes.startsAt",
      //                   studentQuizData: "$studentquizes", // Embed the student quiz data
      //                 },
      //               },
      //             },
      //           },
      //         ])
      //         return {
      //           ...j._doc,
      //           quiz:quiz.map((q)=>{

      //           }) ,
      //         };
      //       })
      //     )
      //   }

      // }));

      return res
        .status(200)

        .json(new ApiResponse(200, childs, "childs founded succesfully"));
    }, 100);
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
});

exports.getMyChildbyId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const findMychilds = await studentModel
      .findOne({
        _id: id,
      })
      .populate(
        ["grade", "auth"]
        // {
        //   path: "grade",
        //   select: ["grade", "subjects"],
        //   // populate: { path: "subjects", select: ["image", "name"] },
        // },
        // { path: "auth", select: "-password" },
      );
    // populate({
    //   path: "childIds",
    //   select: "-password",
    //   populate: [
    //     {
    //       path: "grade",
    //       select: ["grade", "subjects"],
    //       populate: { path: "subjects", select: ["image", "name"] },
    //     },
    //     { path: "auth", select: "-password" },
    //   ],
    // });

    // const childs = findMychilds.childIds;
    return res
      .status(200)
      .json(new ApiResponse(200, findMychilds, "child founded succesfully"));
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});
const subjectModel = require("../models/subject");
const authModel = require("../models/auth");

exports.getMyChildsubjectdata = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    const auth = await studentModel
      .findById(id)
      .populate("subjects")
    // const sub = await subjectModel.aggregate([
    //   {
    //     $match: {
    //       _id: {
    //         $in: auth.subjects
    //           .map((i) => {
    //             return i._id;
    //           })
    //           .flat(),
    //       },
    //     },
    //   },
    // ]);
    

    let findTopicLesson = await topicModel.aggregate([
      {
        $match: {
          subject: {
            $in: auth.subjects
              .map((i) => {
                return i._id;
              })
              .flat(),
          },
          // new mongoose.Types.ObjectId(subject),
        },
      },
      {
        $lookup:{
          from :"subjects",
          let: { subjectId: { $toString: "$subject" } }, // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$subjectId"], // Convert topic field to string and compare
                },
              },
            },
          ],
          as:"subjects",
        },

      },
      {
        $unwind: {
          path: "$subjects", // Specify the field you want to unwind
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "lessons",
          let: { topicId: { $toString: "$_id" } }, // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$topic" }, "$$topicId"], // Convert topic field to string and compare
                },
              },
            },
          ],
          as: "lessons",
        },
      },
      // {
      //   $match:{
      //     "lessons.readyby":{$in:[new mongoose.Types.ObjectId(req.user.profile._id)]}
      //   }
      // },
      {
        $lookup: {
          from: "quizes",
          let: { topicId: { $toString: "$_id" } }, // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$topic" }, "$$topicId"], // Convert topic field to string and compare
                },
              },
            },
          ],
          as: "quizes",
        },
      },
      {
        $unwind: {
          path: "$quizes", // Specify the field you want to unwind
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "studentquizes",
          let: {
            topicId: { $toString: "$quizes._id" },
            stdId: { $toString: id },
          }, // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [{ $toString: "$quiz" }, "$$topicId"], // Convert topic field to string and compare
                    },
                    {
                      $eq: [{ $toString: "$student" }, "$$stdId"], // Convert topic field to string and compare
                    },
                  ],
                },
              },
            },
          ],
          as: "studentquizes",
        },
      },
      {
        $group: {
          _id: "$subject",
          name: { $first: "$subjects.name" },
          topic: { $first: "$name" },

          image: { $first: "$image" },
          // subject: { $first: "$subjects.name" },
          // image: { $first: "$subjects.image" },


          // subjectId: { $first: "$subject" },
          // subjectI: { $first: "$subjects._id" },

          difficulty: { $first: "$difficulty" },
          type: { $first: "$type" },
          lessons: { $first: "$lessons" },

          // Group by topic ID
          // subject: { $first: "$subject" }, // Keep other fields from the original topic
          // name: { $first: "$name" },
          quizes: {
            $push: {
              _id: "$quizes._id", // Keep quiz fields
              title: "$quizes.createdBy",
              questions: "$quizes.questions",
              status: "$quizes.status",
              grade: "$quizes.grade",
              topic: "$quizes.topic",
              subject: "$quizes.subject",
              image: "$quizes.image",
              endsAt: "$quizes.endsAt",
              startsAt: "$quizes.startsAt",
              studentQuizData: "$studentquizes", // Embed the student quiz data
            },
          },
        },
      },
    ]);



    findTopicLesson = await Promise.all(
      findTopicLesson.map(async (i) => {
        let { _id, difficulty, name, image, subject, type, quizes } = i;
        return {
          _id,
          // difficulty,
          name,
          // image,
          subject,

          quizes:
            i.quizes.length > 0
              ? // &&i.quizes[0]?.studentQuizData?.length>0
                await Promise.all(
                  i.quizes
                    .filter(async (q) => {
                      return q?.studentQuizData?.length > 0;
                    })
                    .map(async (q) => {
                      const studentQuizData = await Promise.all(
                        q.studentQuizData.map(async (qs) => {
                          let { marks, score, result, status, student, _id } =
                            qs;
                          return { marks, score, result, status, student, _id };
                        })
                      );
                      return studentQuizData; // This returns an array of studentQuizData
                    })
                ).then((result) => result.flat())
              : null,
          lessonsresult: (
            ([
              ...(await Promise.all(
                i.lessons.map(async (j) => {
                  let { name, image, topic, readby } = j;
                  readby = readby?.map((id2) => id2.toString());
                  return {
                    name,
                    image,
                    topic,
                    // readby,
                    read: readby
                      ? readby?.includes(id)
                        ? true
                        : false
                      : false,
                  };
                })
              )),
            ].filter((j) => {
              return j.read;
            }).length /
              i.lessons.length) *
            100
          ).toFixed(2),
         
        };
      })
    );
    findTopicLesson= await Promise.all(
      findTopicLesson.map(async (i) => {
        let m=0, s=0;
        await Promise.all(
          i.quizes.map((j,i) => {
            m += parseInt(j.marks);
            s += parseInt(j.score);
            
          })
        )
        
        i.quizes = i.quizes.length > 0 ? (m / s) * 100 : 0;
        i.result = ((i.quizes+parseInt(i.lessonsresult))/2).toFixed(2)
        
        i.result = i.result ==0.00||isNaN( i.result )?0:i.result
        delete i.quizes
        delete i.lessons
        return i;
      })
    )
    
    function groupbysubject(arr){
    
      let value = {

      }
      arr.map((i)=>{
        if(!value[i.name]||value[i.name]?.result==0){

          value[i.name]={
  ...i
          }
        }
      })
      return Object.values(value)
    }
    return res.status(200).json(
      new ApiResponse(
        200,
        groupbysubject([...auth.subjects.map((j)=>{
          return {...j._doc,result:0}
        })
//           .filter((i)=>{
// return findTopicLesson.filter((j)=>{
//   return j.name!=i.name
// }).length>0
//         }).map((i)=>{
//           i.result=0
//           return i
//         })
        , ...findTopicLesson]),
        "Subject details succesfully"
      )
    );
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});
exports.getMyChildbysubjectId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { subject } = req.query;
    if (!subject) {
      return res
        .status(200)

        .json({
          success: false,
          message: "Missing subject Id",
        });
    }
    const findTopicLesson = await topicModel.aggregate([
      {
        $match: {
          subject: new mongoose.Types.ObjectId(subject),
        },
      },
      {
        $lookup: {
          from: "lessons",
          let: { topicId: { $toString: "$_id" } }, // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$topic" }, "$$topicId"], // Convert topic field to string and compare
                },
              },
            },
          ],
          as: "lessons",
        },
      },
      // {
      //   $match:{
      //     "lessons.readyby":{$in:[new mongoose.Types.ObjectId(req.user.profile._id)]}
      //   }
      // },
      {
        $lookup: {
          from: "quizes",
          let: { topicId: { $toString: "$_id" } }, // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$topic" }, "$$topicId"], // Convert topic field to string and compare
                },
              },
            },
          ],
          as: "quizes",
        },
      },
      {
        $unwind: {
          path: "$quizes", // Specify the field you want to unwind
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "studentquizes",
          let: {
            topicId: { $toString: "$quizes._id" },
            stdId: { $toString: id },
          }, // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [{ $toString: "$quiz" }, "$$topicId"], // Convert topic field to string and compare
                    },
                    {
                      $eq: [{ $toString: "$student" }, "$$stdId"], // Convert topic field to string and compare
                    },
                  ],
                },
              },
            },
          ],
          as: "studentquizes",
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },

          image: { $first: "$image" },

          subject: { $first: "$subject" },
          difficulty: { $first: "$difficulty" },
          type: { $first: "$type" },
          lessons: { $first: "$lessons" },

          // Group by topic ID
          // subject: { $first: "$subject" }, // Keep other fields from the original topic
          // name: { $first: "$name" },
          quizes: {
            $push: {
              _id: "$quizes._id", // Keep quiz fields
              title: "$quizes.createdBy",
              questions: "$quizes.questions",
              status: "$quizes.status",
              grade: "$quizes.grade",
              topic: "$quizes.topic",
              subject: "$quizes.subject",
              image: "$quizes.image",
              endsAt: "$quizes.endsAt",
              startsAt: "$quizes.startsAt",
              studentQuizData: "$studentquizes", // Embed the student quiz data
            },
          },
        },
      },
    ]);
    return res.status(200).json(
      new ApiResponse(
        200,
        await Promise.all(
          findTopicLesson.map(async (i) => {
            let { _id, difficulty, name, image, subject, type, quizes } = i;
            return {
              _id,
              difficulty,
              name,
              image,
              subject,
              type,
              quizes:
                i.quizes.length > 0 && i.quizes[0]?.studentQuizData?.length > 0
                  ? await Promise.all(
                      i.quizes.map(async (q) => {
                        let { grade, image, status, _id } = q;

                        return {
                          _id,
                          grade: grade ? grade : null,
                          image: image ? image : null,
                          status: status ? status : null,
                          studentQuizData:
                            q?.studentQuizData?.length > 0
                              ? await Promise.all(
                                  q.studentQuizData.map(async (qs) => {
                                    let {
                                      marks,
                                      score,
                                      result,
                                      status,
                                      student,
                                      _id,
                                    } = qs;
                                    return {
                                      marks,
                                      score,
                                      result,
                                      status,
                                      student,
                                      _id,
                                    };
                                  })
                                )
                              : [],
                        };
                      })
                    )
                  : [],
              lessons: await Promise.all(
                i.lessons.map(async (j) => {
                  let { name, image, topic, readby } = j;
                  readby = readby?.map((id2) => id2.toString());
                  return {
                    name,
                    image,
                    topic,
                    // readby,
                    read: readby
                      ? readby?.includes(id)
                        ? true
                        : false
                      : false,
                  };
                })
              ),
            };
          })
        ),
        "Subject details  succesfully"
      )
    );
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});
exports.myFeedBacks = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const findTeacher = await FeedbackModel.find({
      to: id,
    }).populate({
      path: "from",
      select: "-feedback",
      populate: {
        path: "auth",
        select: ["fullName", "image", "profile", "userName"],
      }, // Exclude the 'password' field
    });

    res
      .status(200)
      .json(new ApiResponse(200, findTeacher, "feedbacks Found Successfully"));
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});
exports.getQuizInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await StudentquizesModel.find({
      student: id,
      status: "complete",
    }).populate({ path: "quiz", populate: { path: "subject" } });
    return res
      .status(200)
      .json({ success: true, data, message: "Quiz data found Successfully" });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
exports.getnotification = async (req, res) => {
  try {
    const data = await NotificationModel.find({
      $or: [{ for: req.user?.profile?._id }, { forAll: true }],
    })
      .sort({ _id: -1 })
      .limit(10);
    return res
      .status(200)
      .json({ success: true, data, message: "Notification get Successfully" });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
