const { Router } = require('express')
const router = Router()

// Functions From...
const { renderImage, postComment, renderEditImage, editImage, renderDeleteImage, deleteImage, postLike, renderLandingPage } = require('../controllers/publications_controller')

//Passport User Authorization
const { auth } = require('../config/helper')

//Routes

//Render Images
router.get('/images/:image_id', auth, renderImage)
router.post('/image/:image_id/comment', auth, postComment)
router.post('/image/:image_id/like', auth, postLike)
//Edit Image
router.get('/images/edit/:image_id', auth, renderEditImage)
router.post('/images/edit/:image_id', auth, editImage)
//Delete Image Confirmation
router.get('/images/delete/:image_id', auth, renderDeleteImage)
router.get('/images/deleted/:image_id', auth, deleteImage)

//Landing Page
router.get('/user/landingPage',auth,renderLandingPage)

module.exports = router