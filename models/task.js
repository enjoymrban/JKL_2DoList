let id = 0;

class task {
    constructor(description, isDone) {
        this.id = id;
        this.description = description;        
        this.isDone = isDone; 
        id++;
    }
}

module.exports = task;