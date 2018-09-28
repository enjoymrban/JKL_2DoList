const express = require('express');
const router = express.Router();
const Joi = require('joi');
let task = require('../models/task');
let task1 = new task('test1','0');
let task2 = new task('test2','1');


const tasks = [task1, task2];

function validateTask(task) {
    const schema = {
        discription: Joi.string().min(3).required(),
        status: Joi.number().integer().min(0).max(1)
    };
    return Joi.validate(task, schema);
}


router.get('/', (req, res) => {
    let taskFiltered = [];
    const status = req.query.status;
    for(const t of tasks){
        if(status == t.status){
            taskFiltered.push(t);
        }
    }    
    res.send(taskFiltered);
});



router.get('/:id', (req, res) => {
    const task = tasks.find(g => g.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('The Task with the given id was not found'); //404        

    res.send(task);

});

router.post('/', (req, res) => {
    const {
        error
    } = validateTask(req.body); // const {error} equals result.error --> Object destructering
    if (error) return res.status(400).send(error.details[0].message);
    let taskToPush = new task(req.body.discription, req.body.status)
    tasks.push(taskToPush);
    res.send(taskToPush);

});

router.put('/:id', (req, res) => {
    const task = tasks.find(g => g.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('The Task with the given id was not found'); //404        

    const {
        error
    } = validateTask(req.body); // result.error --> Object destructering
    if (error) return res.status(400).send(error.details[0].message);

    task.name = req.body.name;
    res.send(task);
});

router.delete('/:id', (req, res) => {
    const task = tasks.find(g => g.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('The Genre with the given id was not found'); //404   

    const index = tasks.indexOf(task);
    tasks.splice(index, 1);

    res.send(task);
});

module.exports = router;