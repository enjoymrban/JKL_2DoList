const express = require('express');
const router = express.Router();
const Joi = require('joi');
let task = require('../models/task');
let task1 = new task('test1', false);
let task2 = new task('test2', true);


const tasks = [task1, task2];

// validation for post and put
function validateTask(task) {
    const schema = {
        description: Joi.string().min(3).max(30).required(),
        isDone: Joi.boolean().required()
    };
    return Joi.validate(task, schema);
}

// 'api/tasks' for all tasks 'api/tasks?isDone=true bszw false' filter to gett all done or all todo 
router.get('/', (req, res) => {
    let taskFiltered = [];
    let isDone = req.query.isDone;
    if (isDone != undefined) {
        isDone = (req.query.isDone === 'true');
        for (const t of tasks) {
            if (isDone == t.isDone) {
                taskFiltered.push(t);
            }
        }
        res.send(taskFiltered);
    } else {
        res.send(tasks);
    }
});


// search task by id
router.get('/:id', (req, res) => {
    const task = tasks.find(g => g.id === parseInt(req.params.id));
    if (!task) return res.isDone(404).send('The Task with the given id was not found'); //404        

    res.send(task);

});


// post task
router.post('/', (req, res) => {
    const {
        error
    } = validateTask(req.body); // const {error} equals result.error --> Object destructering
    if (error) return res.status(400).send(error.details[0].message);
    let taskToPush = new task(req.body.description, req.body.isDone)
    tasks.push(taskToPush);
    res.send(taskToPush);

});

// update existing task
router.put('/:id', (req, res) => {
    const task = tasks.find(g => g.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('The Task with the given id was not found'); //404        

    const {
        error
    } = validateTask(req.body); // const {error} equals result.error --> Object destructering
    if (error) return res.status(400).send(error.details[0].message);

    task.description = req.body.description;
    task.isDone = req.body.isDone
    res.send(task);
});

// delete a task
router.delete('/:id', (req, res) => {
    const task = tasks.find(g => g.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('The Genre with the given id was not found'); //404   

    const index = tasks.indexOf(task);
    tasks.splice(index, 1);

    res.send(task);
});

module.exports = router;