const cloudinary = require('cloudinary').v2;
const { model } = require('mongoose');
const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');

//SetUp Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req,file) => {
        return{
            folder: "Lomitos",
            allowFormats: ["png", "jpg", "jpeg", "webp", "pdf"],
            fileFilter: (req,res,cb) =>{
                if(!file.originalname.match(/\.(svg | gif | doc)$/)){
                    return cb(new Error('Archivo no valido'))
                }
                cb(null, file.originalname)
            },
            public_id: `app-${file.orginalname}`
        }
    }
})

const uploadCloud = multer({storage})

module.exports = uploadCloud;