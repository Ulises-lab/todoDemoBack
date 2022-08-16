const router = require("express").Router();

const {getLoggedUser,editProfile, getUserById,onlyAdminRead,deleteAccount} = require('../controllers/user.controller')

const {verifyToken,checkRole} = require('../middleware')

router.get('/my-profile', verifyToken, getLoggedUser);
 
router.patch('/edit-profile',verifyToken,editProfile);

router.delete('/delete-user',verifyToken,deleteAccount);

//Ver perfiles de usuarios
router.get('/:id/profile',verifyToken,getUserById);

//Ver a todos los usuarios
router.get("/admin/users",verifyToken,checkRole(["Admin"]), onlyAdminRead)

module.exports = router;