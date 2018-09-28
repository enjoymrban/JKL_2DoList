let id = 0;

class task {
    constructor(discription, isDone) {
        this.id = id;
        this.discription = discription;        
        this.isDone = isDone; 
        id++;
    }
}

module.exports = task;