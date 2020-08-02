//Dependencies
const express = require('express')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const multer = require('multer')
const flash = require('connect-flash')

//Helpers Functions
const { randomNumber } = require('./config/helper')

// Initializations 
const app = express()
require('./config/passport')


// Settings
app.set('port', process.env.PORT || 4004)
app.set('views', path.join(__dirname, '/views'))
app.set("view engine", "pug")


// Middlewares
app.use(express.urlencoded({ extended: false }))

//Middlewares -> Multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        file.originalname = randomNumber() + ext
        if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
            cb(null, file.originalname)
        } else {
            cb('Error, only images allowed')
        }
    }
})
app.use(multer({
    storage,
}).single('image'))

//Session /Passport
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


// Global Variables
app.use((req, res, next) => {
    res.locals.succes_msg = req.flash('succes_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.user = req.user || null;
    next();
})

// Routes
app.use(require('./routes/home.routes'))
app.use(require('./routes/user.routes'))
app.use(require('./routes/publications.routes'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app