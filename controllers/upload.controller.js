const cloudinary = require('cloudinary').v2;

exports.uploadProcess = async (req,res,next)=>{
    const uploads = (file,folder)=>{
        return new Prommise(resolve =>{
            cloudinary.uploader.upload(file,(result)=>{
                resolve({
                    url: result.url,
                    id: result.original_filename
                },
                    {
                        resouse_type: "auto",
                        folder 
                    })
            })
        })
    }
    const uploader = async (file,folder)=> uploads(path,'Lomitos')
        if(req.method === "POST"){
            const urls = [];
            const files = req.files;
            if(!req.file){
                for(const file of files){
                    const {path} =file
                    const newPath = await uploader(path)
                    urls.push({uri:newPath.url,id:newPath.id, name:file.originalname})
                }
                res.status(200).json({urls,successMessage:'Imagenes Guardadas'})
            }else{
                const {path} = req.file
                const newPath = await uploader(path)
                const url = {uri: newPath.url,id:newPath.id,name:req.file.originalname}
                res.status(200).json({url,siccessMessage:"Imagen guardada"})
            }
        }else{
            res.status(400).json({errorMessage:`${req.method} no permitido!`})
    
        }
    
}

exports.deleteImage = (req,res,next) =>{
    const {name} = req.params
    cloudinary.v2.uploader.destroy(`Lomitos/${name}`, (error,result)=>{
        if(error){
            res.status(400).json({errorMessage:'No se pudo eliminar',error})
        }
        res.status(200).json({successMessage:`Se eliminio el archivo ${name}`})
    })
}