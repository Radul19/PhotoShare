const { Router } = require('express')
const router = Router()
const { auth } = require('../config/helper')
// Functions From...
const { renderUserPage, renderPublication, renderEdit, edit, renderCreateImg, createImage, searchUser, renderSearchedUser, followUser, renderNotifications } = require('../controllers/user_controller')

//Routes
router.get('/user/profile', auth, renderUserPage)

//User Publication
router.get('/user/img', auth, renderPublication)

//User Create Image
router.get('/user/createImage', auth, renderCreateImg)
router.post('/user/createImage', auth, createImage)

//User Edit PersonalInformation
router.get('/user/edit', auth, renderEdit)
router.post('/user/edit', auth, edit)

//Notify
router.get('/user/:user_id/notifications', renderNotifications)

//Search
router.get('/search/searchUser', auth, searchUser)
router.get('/user/find/:user_id', auth, renderSearchedUser)
router.post('/user/find/:user_id/follow', auth, followUser)

// router.get('user/find/:user_id/private', auth, renderPrivateUser)
module.exports = router