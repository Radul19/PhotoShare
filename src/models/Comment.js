const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
    user_pic:{type:String,required:true},
    image_id: { type: String, required: true },
    username: { type: String, required: true },
    user_id:{type:String,required:true},
    comment: { type: String, require: true },
}, {
    timestamps: true
})


module.exports = model('Comment', commentSchema)