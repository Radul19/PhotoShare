const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
  picture:{type:String,default:'/img/user.png'},
  username: { type: String, required: true },
  description: { type: String, default:'' },
  email: { type: String, required: true },
  password: { type: String, required: true },
  followers: { type: Array, default: '0' },
  following: { type: Array, default: '0' },
  hidden: { type: Boolean },
  notifyTotal:{type:Number,default:0},
  notifySeen:{type:Number,default:0}
}, {
  timestamps: true
})

UserSchema.methods.encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
UserSchema.methods.totalFollowers = (item) => {
  var totalItems = item.length
  return totalItems
}


module.exports = model('User', UserSchema)

