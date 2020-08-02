const passport = require('passport')
const homeControl = {}

// Models
const User = require('../models/User');

//ROUTES///////////////////////////

//Home Routes
homeControl.renderIndex = (req, res) => {
    res.render('home/index')
}
//Login Routes
homeControl.renderLogin = (req, res) => {
    res.render('home/login')
}
//Authenticate Login with Passport
homeControl.login = (passport.authenticate('local', {
    failureRedirect: 'login',
    successRedirect: 'user/profile',
}))


//Register Page
homeControl.renderRegister = (req, res) => {
    res.render('home/register')
}
//Register User Code
homeControl.register = async (req, res) => {
    const { username, email, password, confirm_password } = req.body;
    if (password != confirm_password) {
        req.flash('error_msg', 'Passwords do not match')
        res.redirect('register')
    } else {
        const emailUser = await User.findOne({ email })
        const searchUsername = await User.findOne({username})
        if (searchUsername) {
            req.flash('error_msg', 'Username already in use')
            res.redirect('register')
        }
        else if (emailUser) {
            req.flash('error_msg', 'Email already in use')
            res.redirect('register')
        } else {
            const newUser = new User({ username, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save()
            req.flash('succes_msg', 'Account created succesfully')
            res.redirect('login')
        }
    }

}

//Logout
homeControl.logout = (req, res) => {
    req.logout();
    res.redirect("/");
};


module.exports = homeControl