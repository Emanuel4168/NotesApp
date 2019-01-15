const mongoose = require('mongoose')
const {Schema} = mongoose

const noteSchema = new Schema({
    title: {type: String, required: true, },
    description: {type: String, required: true},
    Date: {type: Date, default: Date.now},
    idUser: {type: String}
})

module.exports = mongoose.model('Note',noteSchema)