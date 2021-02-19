const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')

exports.register = async (req, res, next) => {
    const {username, email, password} = req.body
    
    try {
        const user = await User.create({
            username, email, password
        })

        sendToken(user, 201, res)
    } catch (error) {
        next(error)    
    }
    }


exports.login = async (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password) {
        return next(new ErrorResponse('Por favor forneça email e senha', 400))
    }
    
    try {
        const user = await User.findOne({ email }).select('+password')

        if(!user) {
            return next(new ErrorResponse('credenciais invalidas', 404))
        }

        const isMatch = await user.matchPassword(password)

        if(!isMatch) {
            return next(new ErrorResponse('credenciais invalidas', 401))
        }

        sendToken(user, 200, res)
    } catch (error) {

    }   res.status(500).json({success: false, error: 'message'})
}



exports.forgotpassword = async (req, res, next) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if(!user) {
            return next(new ErrorResponse('email nao enviado', 404))
        }

        const resetToken = user.getResetPasswordToken()

        await user.save()
        
        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`
    
        const message = `
            <h1>Voce solicitou refazer a senha</h1>
            <p>por favor va para este link para refazer a senha</p>
            <a href=${resetUrl} clicktracking='off' >${resetUrl}</a>
            `

            try {
                await sendEmail({
                    to: user.email,
                    subject: 'Password Caramelo',
                    text: message
                })
                res.status(200).json({success: true, data: "email enviado"})
            }catch (error) {
                user.resetPasswordToken = undefined
                user.resetPasswordExpire = undefined
                
                await user.save()
                return next(new ErrorResponse('email pode nao ter sido enviado', 500))
            }

    } catch (error) {
        next(error)
    }
}

exports.resetpassword = (req, res, next) => {
    res.send('Rota reset de senha')
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({ success: true, token })
}