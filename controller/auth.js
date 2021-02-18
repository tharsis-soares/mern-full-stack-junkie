const User = require('../models/User')

exports.register = async (req, res, next) => {
    const {username, email, password} = req.body
    
    try {
        const user = await User.create({
            username, email, password
        })

        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

exports.login = (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password) {
        res.status
    }
    
    res.send('Rota de login')
}

exports.forgotpassword = (req, res, next) => {
    res.send('Rota esqueceu da senha')
}

exports.resetpassword = (req, res, next) => {
    res.send('Rota reset de senha')
}