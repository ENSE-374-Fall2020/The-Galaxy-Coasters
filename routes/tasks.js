const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Task = require('../models/task')
const User = require('../models/user')
const uploadPath = path.join('public', User.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne(req.params.id)
            const tasks = await Task.find({})
            res.render('tasks/index', {
                tasks: tasks,
                user: user,
                reminderMessage: "Overdue",
                notifyMessage: "Deadline coming up"
            })
        } catch (e) {
            console.log(e)
            res.render('home')
        }
    }
    else{
        res.render('home')
    }
})

router.get('/search', async (req, res) => {
    if (req.isAuthenticated()) {
        let searchOptions = {}
        if (req.query.name != null && req.query.name !== '') {
            searchOptions.name = new RegExp(req.query.name, 'i')
        }
        try {
            tasks = await Task.find(searchOptions).sort({ dueDate: 'asc' })
            const user = await User.findOne(req.params.id)
            res.render('tasks/search', {
                tasks: tasks,
                user: user,
                searchOptions: req.query,
                reminderMessage: "Overdue",
                notifyMessage: "Deadline coming up"
            })
        } catch (e) {
            console.log(e)
            res.redirect('/tasks')
        }
    }
    else {
        res.render('/')
    }
})


//ADD TASK FOR DISPLAYIN ONLY
router.get('/new', async (req, res) => {
    if (req.isAuthenticated) {
        const user = await User.findOne(req.params.id)
        res.render('tasks/new', {
            task: new Task(),
            user: user
        })
    }
    else {
        res.render('home')
    }
})



//CREATING TASK FOR ADD TASK
router.post('/', async (req, res) => {
    if (req.isAuthenticated()) {
        let task = new Task({
            name: req.body.name,
            note: req.body.note,
            dueDate: req.body.dueDate,
            progress: req.body.progress,
            user: req.user.id,
        })
        try {
            const newTask = await task.save()
            res.redirect('tasks/')
        } catch {
            res.render('tasks/new', {
                task: task,
                errorMessage: 'Error creating task'
            })
        }
    }
    else {
        res.render('/')
    }

})

router.get('/:id/edit', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({})
            console.log(user)
            const task = await Task.findById(req.params.id)
            res.render('tasks/edit', { task: task, user: user})
        } catch {
            res.render('home')
        }
    }
    else {
        res.render('home')
    }
})

router.get('/account', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne(req.params.id)
            res.render('tasks/account', { user: user })
        } catch (e) {
            res.redirect('/')
        }
    }
    else {
        res.render('home')
    }
})

router.post('/account', upload.single('cover'), async (req, res) => {
    if (req.isAuthenticated()) {
        const fileName = req.file.filename != null ? req.file.filename : null
        const user = await User.findOne(req.params.id)
        user.username = req.body.username
        user.firstName = req.body.firstName
        user.lastName = req.body.lastName
        user.about = req.body.about
        user.coverImageName = fileName
        try {
            const ur = await user.save()
            res.render('tasks/account', { user: user })
        }
        catch (e) {
            console.log(e)
            if (user == null) {
                res.redirect('/')
            } else {
                res.render('tasks/account', {
                    user: user,
                    errorMessage: 'Error updating user'
                })
            }
        }
    }
    else {
        res.render('/')
    }
})


router.put('/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        let task
        try {
            task = await Task.findById(req.params.id)
            task.name = req.body.name
            task.note = req.body.note
            task.dueDate = req.body.dueDate
            task.progress = req.body.progress
            await task.save()
            if (task.progress == 100) {
                task.done = true
            }
            await task.save()
            res.redirect(`/tasks`)
        } catch {
            if (task == null) {
                res.redirect('/')
            } else {
                res.render('tasks/edit', {
                    task: task,
                    errorMessage: 'Error updating task'
                })
            }
        }
    }
    else {
        res.render('/')
    }
})

router.delete('/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        let task
        try {
            task = await Task.findById(req.params.id)
            await task.remove()
            res.redirect('/tasks')
        } catch {
            if (task == null) {
                res.redirect('/')
            } else {
                res.redirect(`/tasks/${task.id}`)
            }
        }
    }
    else {
        res.render('/')
    }
})

router.get('/finished', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne(req.params.id)
            const tasks = await Task.find({})
            res.render('tasks/finished', { tasks: tasks, user: user })
        } catch {
            res.redirect('/')
        }
    }
    else {
        res.render('/')
    }
})


module.exports = router