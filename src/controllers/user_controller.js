
const userControl = {}
const fs = require('fs')

//Helper
const { writeMessage, tagUser, lessExt } = require('../config/helper')

// Models
const Image = require('../models/images')
const User = require('../models/User');
const Notify = require('../models/Notifications')
const Comment = require('../models/Comment')

//UserPage
userControl.renderUserPage = async (req, res) => {
    let userImages = []
    const activeUser = res.locals.user
    let bell = false
    const allImages = await Image.find().sort({ timestamp: -1 })
    for (each of allImages) {
        if (each.owner == req.user.username) {
            userImages.push(each)
        }
    }
    if (activeUser.notifyTotal > activeUser.notifySeen) { bell = true }
    res.render('profile/user', { userImages, bell })
}

//User Publications Screen
userControl.renderPublication = (req, res) => {
    res.render('publications/img')
}
userControl.renderFollow = (req, res) => {
    if (req.user) {
        res.render('publications/img')
    } else {
        console.log('error user not found')
    }
}

//User Edit Data
userControl.renderEdit = (req, res) => {
    res.render('profile/edit')
}
userControl.edit = async (req, res) => {
    let bool = false
    const user = await User.findOne({ email: req.user.email })
    const oldUsername = res.locals.user.username
    const { username, description } = req.body
    const image = req.file
    const userComments = await Comment.find({ username: oldUsername })
    const userImages = await Image.find({ owner: oldUsername })
    const userNotifys = await Notify.find({ thrower: oldUsername })
    const recNotifys = await Notify.find({ receiver: oldUsername })
    //Search for same username>
    const sUsername = await User.findOne({ username })
    console.log(sUsername)
    if (sUsername) {
        req.flash('error_msg', 'Username already in use')
        res.redirect('/user/edit')
    }else{

        console.log(sUsername)
        if (username) {
            user.username = username
            for (Images of userImages) {
                Images.owner = username
                await Images.save()
            }
            for (newComment of userComments) {
                newComment.username = username
                await newComment.save()
            }
            for (eachNotify of userNotifys) {
                eachNotify.thrower = username
                await eachNotify.save()
            }
            for (eachNotify of recNotifys) {
                eachNotify.receiver = username
                await eachNotify.save()
            }
        }
        if (image) {
            //Delete old img
            if (user.picture != '/img/user.png') {
                fs.unlink(`src/public/${user.picture}`, (err) => {
                    if (err) { console.log(err) }
                })
            }
            user.picture = '/uploads/' + image.originalname
            for (newComment of userComments) {
                newComment.user_pic = user.picture
                await newComment.save()
            }
            for (eachNotify of userNotifys) {
                eachNotify.throwerPic = user.picture
                await eachNotify.save()
            }
        }
        if (description) { user.description = description }
        if (req.body.hide == 'on') { bool = true }
        user.hidden = bool
        await user.save()
        req.flash('succes_msg', 'Profile data update succesfully')
        res.redirect('profile')
    }
}
//User Create Img
userControl.renderCreateImg = (req, res) => {
    res.render('publications/createImage')
}
userControl.createImage = async (req, res) => {
    let bool = false
    //If Private Image
    if (req.body.hide == 'on') { bool = true }
    //Create img
    const newImage = new Image({
        owner: req.user.username,
        fileExtension: req.file.originalname,
        filename: lessExt(req.file.originalname),
        description: req.body.description,
        hidden: bool
    })
    //See if someones is Tag
    const tag = tagUser(req.body.description)
    if (tag) {
        const Find = await User.findOne({ username: tag })
        if (Find) {
            const newNotify = new Notify({
                throwerPic: res.locals.user.picture,
                thrower: res.locals.user.username,
                link: `/images/${lessExt(req.file.originalname)}`,
                receiver: Find.username,
                message: writeMessage(3)
            })
            Find.notifyTotal += 1
            await Find.save()
            await newNotify.save()
        }
    }
    await newImage.save()
    res.redirect('profile')
}

//Search User
userControl.searchUser = async (req, res) => {
    const search = req.query.userToSearch
    const Profiles = await User.find({ username: { $regex: search } })
    res.render('profile/searchUser', { Profiles })
}
//Render Searched User
userControl.renderSearchedUser = async (req, res) => {
    const Owner = await User.findOne({ _id: req.params.user_id })
    const Publications = await Image.find({ owner: Owner.username })
    const ActiveUser = await User.findOne({ email: res.locals.user.email })
    let extranger = true
    //Validate if Private/Public User
    for (position of Owner.followers) {
        if (position === ActiveUser.email) {
            extranger = false
        }
    }
    //Validate if is the same User
    if (ActiveUser.email === Owner.email) {
        res.redirect('/user/profile')
    } else {
        res.render('profile/anotherUser', { Owner, Publications, ActiveUser, extranger })
    }
}
//Follow - Unfollow user
userControl.followUser = async (req, res) => {
    const Owner = await User.findOne({ _id: req.params.user_id })
    const activeUser = await User.findOne({ _id: res.locals.user._id })
    let aux = 0
    let extranger = true
    for (let position of Owner.followers) {
        if (position === activeUser.email) {
            await Owner.followers.splice(aux, 1)
            await activeUser.following.splice(aux, 1)
            extranger = false
        }
        aux++
    }
    if (extranger) {
        Owner.followers.push(activeUser.email)
        activeUser.following.push(Owner.email)
        //Notify
        const newNotify = new Notify({
            link: `/user/find/${activeUser._id}`,
            throwerPic: activeUser.picture,
            thrower: activeUser.username,
            receiver: Owner.username,
            message: writeMessage(2),
        })
        Owner.notifyTotal += 1
        await newNotify.save()
    }
    await Owner.save()
    await activeUser.save()

    res.redirect(`/user/find/${Owner._id}`)

}
//Render Notifications
userControl.renderNotifications = async (req, res) => {
    const user = await User.findOne({ _id: req.params.user_id })
    const notifications = await Notify.find({ receiver: user.username }).sort({ createdAt: 'desc' })
    let total = user.notifyTotal
    user.notifySeen = total
    await user.save()
    res.render('profile/notifications', { notifications, user })
}



module.exports = userControl