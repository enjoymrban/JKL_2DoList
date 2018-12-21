let taskId = 0;

class task {
    constructor(description, category) {
        this.id = taskId;
        this.description = description;
        this.category = category;
        taskId++;
    }

    setTaskIdTo0(){
        taskId = 0;
    }

   
}

module.exports = task;