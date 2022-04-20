const express = require('express')
const userController = require('../controller/userController')
const router = express.Router()
const auth = require('../middleware/auth')
const checkRole = require('../middleware/checkRole')


router.post('/create',  auth, checkRole("admin"), userController.addUser)
router.get('/read', auth, userController.viewUser)
router.put('/update/:id',  auth, checkRole("admin"), userController.updateUser)
router.delete('/delete/:id', auth, checkRole("admin"), userController.deleteUser)

router.post('/login', userController.login)
router.post('/logout', auth, userController.logOut)
router.post('/logOutAll', auth, userController.logOutAll)
module.exports = router