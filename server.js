if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const passport = require('passport')

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email)
)

const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const signupRouter = require('./routes/signup')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false, limit:'10mb'}))


const mongoose = require('mongoose')
const user = require('./models/user')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connect to Mongoose'))

app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/signup', signupRouter)


app.listen(process.env.PORT || 3000)