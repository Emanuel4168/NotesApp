const mongoose = require('mongoose')
const {Schema} = mongoose
const bCrypt = require('bcryptjs')

const userSchema = new Schema({
    name: {type: String, required: true, },
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}
})

userSchema.methods.encryptPassword = async(password) =>{
    const salt = await bCrypt.genSalt(10)
    return bCrypt.hash(password,salt)
}

userSchema.methods.matchPassword = async function (password) {
    return await bCrypt.compare(password,this.password)
}

module.exports = mongoose.model('User',userSchema)