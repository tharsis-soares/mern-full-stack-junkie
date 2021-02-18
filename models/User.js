const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Por favor digite um usuario']
    },
    email: {
        type: String,
        required: [true, 'por favor digite um email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Por favor um email valido"
        ]
    },
    password: {
        type: String,
        required: [true, 'Por favor digite a senha'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        next()
    }
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.matchPasswords = async function(password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User