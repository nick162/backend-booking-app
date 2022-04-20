const express = require('express')
const bookingController = require('../controller/bookingController')
const {uploadSingle} = require('../middleware/multer')
const auth = require('../middleware/auth')
const checkRole = require('../middleware/checkRole')

const router = express.Router()

router.post('/create', uploadSingle, bookingController.createBooking)
router.get('/read', auth, bookingController.viewBooking)
router.get('/read-detail/:id', auth, bookingController.showDetailBooking)
router.put('/reject/:id',  auth, checkRole("admin"), bookingController.actionReject)
router.put('/accept/:id',  auth, checkRole("admin"), bookingController.actionAccept)
router.delete('/delete/:id',  auth, checkRole("admin"), bookingController.deleteBooking)
router.delete('/delete-reject/:id', auth, checkRole("admin"), bookingController.deleteBookingReject)
module.exports = router