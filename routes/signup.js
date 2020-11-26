const express = require('express')
const router = express.Router()
const User = require('../models/user')


router.get('/', async(req, res) => {
    try{
        const users = await User.find({})
        res.render('signup/signup', { users: users })
    } catch {
        res.redirect('/')
    }
})

//new account route
router.get('/', (req, res) => {
    res.render('signup/signup', { user: new User() })
})

//create account route
router.post('/', async (req,res) => {
    const hashPassword = await bcrypt.hash(req.body.password, 10)

    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashPassword
    })
    try{
        const newUser = await user.save()
            // res.redirect(`signup/${newUser.id}`)
        res.redirect(`signup`)
    } catch {
        res.render('signup/signup', {
            user: user,
            errorMessage: 'Error creating User'
         }) }
    })

module.exports = router