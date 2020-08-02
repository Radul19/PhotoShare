const { Router } = require('express')
const router = Router()

// Functions From...
const { renderIndex, renderLogin, renderRegister, register, login, logout } = require('../controllers/home_controller')

//Routes

//Home Page
router.get('/', renderIndex)

//Register Page
router.get('/register', renderRegister)
router.post('/register', register)

//Login Page
router.get('/login', renderLogin)
router.post('/login', login)

//Logout 
router.get('/logout', logout)

module.exports = router