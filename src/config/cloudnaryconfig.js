

// import { v2 as cloudinary } from 'cloudinary';
const cloudinary = require("cloudinary")
 cloudinary.config({
    cloud_name: 'deiylfley', 
        api_key: '344529146898383', 
        api_secret: 'NeRfIKr8YIFbeRmx1YtH205mYX0' 
});
module.exports = cloudinary;

