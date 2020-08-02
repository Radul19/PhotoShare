const fs = require('fs')
const imagesControl = {}

//Helpers
const { writeMessage, tagUser, lessExt } = require('../config/helper')

// Models
const Images = require('../models/images')
const Comment = require('../models/Comment')
const Notify = require('../models/Notifications')
const User = require("../models/User")


//ROUTES

//Render Image
imagesControl.renderImage = async (req, res) => {
    const Image = await Images.findOne({ filename: req.params.image_id })
    const Comments = await Comment.find({ image_id: req.params.image_id })
    res.render('publications/img', { Image, Comments })
}
//Image Like 
imagesControl.postLike = async (req, res) => {
    const Image = await Images.findOne({ filename: req.params.image_id })
    const activeUser = res.locals.user
    let bool = false
    let aux = 0
    //Add - Delete like
    for (position of Image.likes) {
        if (position === activeUser.email) {
            await Image.likes.splice(aux, 1)
            bool = true
        }
        aux++
    }
    if (!bool) {
        Image.likes.push(activeUser.email)
        //Send notify
        const newNotify = new Notify({
            link: `/images/${Image.filename}`,
            throwerPic: activeUser.picture,
            thrower: activeUser.username,
            receiver: Image.owner,
            message: writeMessage(1),
        })
        //Write Notify count
        const findUser = await User.findOne({ username: newNotify.receiver })
        findUser.notifyTotal += 1

        findUser.save()
        newNotify.save()
    }
    await Image.save()
    res.redirect(`/images/${req.params.image_id}`)
}

//Post Comment
imagesControl.postComment = async (req, res) => {
    const imageURL = req.params.image_id
    const newComment = new Comment({
        user_pic: req.user.picture,
        image_id: imageURL,
        username: req.user.username,
        user_id: req.user._id,
        comment: req.body.comment,
    })
    console.log(req.user)
    await newComment.save()
    res.redirect(`/images/${imageURL}`,)
}

//Render edit Image
imagesControl.renderEditImage = async (req, res) => {
    const Image = await Images.findOne({ filename: req.params.image_id })
    res.render('publications/editImage', { Image })
}
//Edit Image function
imagesControl.editImage = async (req, res) => {
    let bool = false
    //If Private Image
    if (req.body.hide == 'on') { bool = true }

    const findImage = await Images.findOne({ filename: req.params.image_id })
    findImage.description = req.body.description
    findImage.hidden = bool
    //See if someones is Tag
    const tag = tagUser(req.body.description)
    if (tag) {
        const Find = await User.findOne({ username: tag })
        if (Find) {
            const newNotify = new Notify({
                throwerPic: res.locals.user.picture,
                thrower: res.locals.user.username,
                link: `/images/${req.params.image_id}`,
                receiver: Find.username,
                message: writeMessage(3)
            })
            Find.notifyTotal += 1
            await Find.save()
            await newNotify.save()
        }
    }
    await findImage.save()
    res.redirect(`/images/${req.params.image_id}`)
}
//Delete Image
imagesControl.renderDeleteImage = async (req, res) => {
    const Image = await Images.findOne({ filename: req.params.image_id })
    res.render('publications/deleteImage', { Image })
}
imagesControl.deleteImage = async (req, res) => {
    const Image = await Images.findOne({ filename: req.params.image_id })
    await Image.deleteOne()
    fs.unlink(`src/public/uploads/${Image.fileExtension}`, (err) => {
        if (err) { console.log(err) }
        console.log('Image deleted')
    })
    req.flash('succes_msg', 'Publication Deleted Succesfully')
    res.redirect('/user/profile')
}

// Render LandingPage
imagesControl.renderLandingPage = async (req, res) => {
    let allImages = []
    let aux = 0
    activeUser = res.locals.user
    //Buscar cada usuario que se esta siguiendo -> Cada publicacion de cada usuario (que no sea privada), añadirla una por una a un Array, para luego ordenarlo y mostrarlo en LandignPage
    for (follow of activeUser.following) {
        if (follow) {
            let searchUser = await User.findOne({ email: follow })
            if (searchUser != null) {
                let Image = await Images.find({ owner: searchUser.username, hidden: false }).sort({ createdAt: 'desc' })
                for (each of Image) {
                    allImages.push(each)
                }
            }
        }
        aux++
    }
    //Ordernamiento
    allImages.sort(function (a, b) {
        if (a.createdAt > b.createdAt) {
            return -1;
        }
        if (a.createdAt < b.createdAt) {
            return 1;
        }
        return 0;
    });;

    res.render('publications/landingPage', { allImages })
}

module.exports = imagesControl