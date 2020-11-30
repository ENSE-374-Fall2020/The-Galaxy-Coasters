const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    note: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    progress: {
        type: Number,
    },
    done: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Task', taskSchema);


