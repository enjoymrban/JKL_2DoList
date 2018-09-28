let id = 3;

class task {
    constructor(discription, status) {
        this.id = id;
        this.discription = discription;        
        this.status = status;  // 0 = todo, 1 = done
    }
}

module.exports = task;