const jwt = require('jsonwebtoken')

exports.clearRes = (data) =>{
    const {password,createdAt,updatedAt,__v,...restData} = data
    return restData
}

exports.createJWT = (user) =>{
    return jwt.sign({
        userId:user._id,
        email:user.email,
        role:user.role
        //se puede colocar el role, el username, etc,etc.
    }, process.env.SECRET,{expiresIn:'24h'}).split('.')
}