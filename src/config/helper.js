const path = require('path')
const helper = {}
//Generate a random ID to Images
helper.randomNumber = () => {
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let randomId = 0
    for (let i = 0; i < 10; i++) {
        randomId += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return randomId

}
//Authorize Login
helper.auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/login')
    }
}
//Elimina la extension de un archivos
helper.lessExt = (name) => { return name.replace(path.extname(name), '') }

//Notify message
helper.writeMessage = (x) => {
    switch (x) {
        case 1: return 'Le ha gustado tu foto'; break;
        case 2: return 'Ha comenzado a seguirte'; break;
        case 3: return 'Te ha etiquetado en una foto'; break;
    }
}
//Tag user to Notify
helper.tagUser = (text) => {
    let tag = []
    const regEx = /@[a-zA-Z]{1,}/
    const long = text.length
    let bool1 = false
    for (let i = 0; i < long; i++) {
        if (text.charAt(i) == '@') {
            bool1 = true
        }
        if (bool1) {
            if (text.charAt(i) == ' ') {

                bool1 = false
            }
        }
        if (bool1) {
            tag.push(text.charAt(i))
        }
    }
    tag.splice(0, 1)
    tag = tag.join('')
    return tag
}

module.exports = helper