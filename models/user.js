const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")
const path = require('path')
const coverImageBasePath = 'uploads/UserPhoto'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        firstName: {
            type: String,
            require: true
        },
        lastName: {
            type: String,
            require: true
        },
        about: {
            type: String,
        },
        coverImageName: {
            type: String,
        }
    });

userSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})
userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', userSchema)
module.exports.coverImageBasePath = coverImageBasePath


