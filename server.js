const express = require("express")
const session = require("express-session")
const mongoose = require("mongoose")
const passport = require("passport");
const methodOverride = require('method-override')
const app = express();

bodyParser = require('body-parser')
mongoose.connect("mongodb://localhost:27017/onlineplanner", {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
});

const User = require("./models/user")
const Task = require("./models/task")
const taskRouter = require('./routes/tasks');
const e = require("express");


app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: true, limit:'50mb'}))
app.use(bodyParser.json());
app.set('view engine', 'ejs');


app.use(express.static('public'))
app.use(session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/tasks', taskRouter)

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const port = 3000

app.listen(port, function () {
    console.log(' server is running ' + port)
})


app.get('/', function (req, res) {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err) }
        if (!user) {
            console.log(info);

            res.render('login', {errorMessage: "Incorrect email or password" })
        }
        req.logIn(user, async function (err) {
            if (err) {
                return next(err)
            }
            res.redirect('/tasks')
        })
    })(req, res, next)
})

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', (req, res) => {
    User.findOne({ username: req.body.username }).then((user) => {
        if (user) {
            return res.render('register',
            {errorMessage: "A user has already registered with this email"}
            )
        }
        else {
            User.register({
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }, req.body.password,
                function (err, user) {
                    if (err) {
                        console.log(err)
                        res.render('/register')
                    } else {
                        passport.authenticate("local")(req, res, function () {
                            console.log("Registered Successfully")
                            res.redirect('/login')
                        })
                    }
                })
        }
    })
})

app.get('/logout', (req, res) => {
    console.log("Loggin out")
    req.logout()
    res.redirect('/')
})


