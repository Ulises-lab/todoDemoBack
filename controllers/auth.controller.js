const User = require("../models/User.model")
const mongoose = require('mongoose')

const bcryptjs = require("bcryptjs")
const {clearRes, createJWT} = require('../utils/utils')

exports.signupProcess = (req, res, next) => {
    const {role,email,password,confirmPassword, ...restUser} = req.body
    if(!email.length||!password.length||!confirmPassword.length) return res.status(400).json({errorMessage: "No mandes campos vacios!"});
  
    if(password!=confirmPassword) return res.status(400).json({errorMessage: "El password no es igual"});
  
    User.findOne({email})
    .then(found => {
      if(found) res.status(400).json({errorMessage: "Intenta con otro corrreo"});
  
      return bcryptjs.genSalt(10)
          .then(salt => bcryptjs.hash(password,salt))
          .then(hasedPassword=>{
              return User.create({email,password:hasedPassword,...restUser})
          })
          .then(user=>{
              const [header,payload,signature] = createJWT(user)
              res.cookie('headload',`${header}.${payload}`,{
                  maxAge:1000*60*30,
                  httpOnly:true,
                  sameSite:'strict',
                  secure:false
              })
  
              res.cookie('signature',signature,{
                  maxAge:1000*60*30,
                  httpOnly:true,
                  sameSite:'strict',
                  secure:false
              })
              const newUser = clearRes(user.toObject())
              res.status(200).json({user:newUser})
          })
    })
    .catch(error =>{
      if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage:
              "El correo electronico ya esta en uso.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
    })
  
  
}

exports.loginProcess = (req,res,next) =>{
    const {email,password} = req.body
    if(!email||!password ||!email.length||!password.length) return res.status(400).json({errorMessage: "No mandes campos vacios!"});
    
    User.findOne({email})
    .then(user=>{
        if(!user) res.status(400).json({errorMessage: "Credenciales invalidas"});
        return bcryptjs.compare(password,user.password)
        .then(match =>{
            if(!match) return es.status(400).json({errorMessage: "Credenciales invalidas"});
            const [header,payload,signature] = createJWT(user)
            res.cookie('headload',`${header}.${payload}`,{
                maxAge:1000*60*30,
                httpOnly:true,
                sameSite:'strict',
                secure:false
            })

            res.cookie('signature',signature,{
                maxAge:1000*60*30,
                httpOnly:true,
                sameSite:'strict',
                secure:false
            })
            const newUser = clearRes(user.toObject())
            res.status(200).json({user:newUser})
        })
    })
    .catch(error =>{
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).json({
              errorMessage:
                "El correo electronico ya esta en uso.",
            });
          }
          return res.status(500).json({ errorMessage: error.message });
    })
}

exports.logoutProcess = (req,res,next) =>{
    res.clearCookie('headload')
    res.clearCookie('signature')
    res.status(200).json({successMessage: 'Saliste todo chido, regresa pronto :D !'})
}