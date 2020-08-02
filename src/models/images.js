const { Schema, model } = require('mongoose')
const imageSchema = new Schema({
    owner: { type: String, required: true },
    fileExtension: { type: String },
    filename: { type: String, },
    description: { type: String },
    likes: { type: Array,default:'0'},
    hidden:{type:Boolean,default:false}
}, {
    timestamps: true
})

imageSchema.methods.totalLikes = (item) =>{
    var totalLikes = item.length
    return totalLikes
}

module.exports = model('images', imageSchema)