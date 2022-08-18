const router = require("express").Router();

const {uploadProcess, deleteImage} = require('../controllers/upload.controller')

const uploadCloud= require('../helpers/cloudinary')

const { verifyToken } = require('../middleware')

router.post('/uploads',uploadCloud.array('images',3),uploadProcess)

router.post('/single',uploadCloud.single('image'),uploadProcess)

router.delete('/delete-images/:name',verifyToken,deleteImage)

module.exports = router;