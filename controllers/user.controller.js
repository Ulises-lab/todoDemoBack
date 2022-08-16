const User = require('../models/User.model');
const { clearRes } = require('../utils/utils');
const mongoose = require('mongoose')

exports.getLoggedUser = (req,res,next) =>{
    res.status(200).json({user:req.user})
}

exports.editProfile= (req,res,next) =>{
    const {role, password,...restUser} = req.body
    const {_id} = req.user
    User.findByIdAndUpdate(_id,{...resUser},{new:true})
    .then(user =>{
        const newUser = clearRes(user.toObject())
        res.status.json(200).json({user:newUser})
    })
    .catch(error =>{
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).json({
              errorMessage:
                "Hubo un error",
            });
          }
          return res.status(500).json({ errorMessage: error.message });
    })
}

//http://www.pruebaPerritos.com/api/user/38492eqkuehiq/profile
exports.getUserById = (req,res,next) =>{
    const {id} = req.params;

    User.findById(id)
    .then(user =>{
        const newUser = clearRes(user.toObject())
        res.status(200).json({user:newUser})

    })
    .catch(error =>{
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).json({
              errorMessage:
                "Hubo un error",
            });
          }
          return res.status(500).json({ errorMessage: error.message });
    })
}

exports.onlyAdminRead =(req,res,next) =>{
    User.find({role:{$ne:"Admin"}},{password:0})
    .then(users =>{
        res.status(200).json({users})
    })
    .catch(error =>{
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).json({
              errorMessage:
                "Hubo un error",
            });
          }
          return res.status(500).json({ errorMessage: error.message });
    })
}

exports.deleteAccount = (req,res,next) => {
    const {_id} = req.user
    User.findByIdAndRemove(_id)
    .then(() =>{
        res.clearCookie('headload');
        res.clearCookie('signature');
        res.status(200).json({successMessage:"Usuario borrado"})
    })
    .catch(error =>{
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).json({
              errorMessage:
                "Hubo un error",
            });
          }
          return res.status(500).json({ errorMessage: error.message });
    })
}