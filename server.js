require("dotenv").config({path: "./config.env"})
const express = require("express")
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

connectDB()

const app = express()

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/private', require('./routes/private'))

app.use(errorHandler)

const PORT = process.env.PORT || 5000 

const server = app.listen(PORT, () => console.log(`conectado porta ${PORT}`))

process.on('unhandledRejection', (err, promise) => {
    console.log(`Log de erros: ${err}`)
    server.close(() => process.exit(1))
})