const passport = require('passport')
const localStrategy = require('passport-local').Strategy

const User = require('../models/User')

//Passport Validation
passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, next) => {
    //Match email
    const user = await User.findOne({ email })
    if (!user) {
        return next(null, false, { message: 'not user found' })
    } else {
        //Match password
        const match = await user.matchPassword(password)
        if (match) {
            return next(null, user)
        } else {
            return next(null, false, { message: 'Incorrect password' })
        }
    }
}))

passport.serializeUser((user, next) => {
    next(null, user.id)
})

passport.deserializeUser((id, next) => {
    User.findById(id, (err, user) => {
        next(err, user)
    })
})