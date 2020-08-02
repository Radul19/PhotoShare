const { Schema, model } = require('mongoose')

const notifySchema = new Schema({
    throwerPic:{type:String,required:true},
    thrower: { type: String, required: true },
    link:{type:String,required:true},
    receiver: { type: String, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true
})



module.exports = model('Notifications', notifySchema)