const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Message = new Schema(
    {
        title: {type: String, required: true},
        body: {type: String, required: true},
        username: {type: String, required: true},
        timestamp: {type: String, required: false}
    }
)

module.exports = mongoose.model('Message', Message)