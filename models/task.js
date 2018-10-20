let id = 0;

class task {
    constructor(description, category) {
        this.id = id;
        this.description = description;
        this.category = category;
        id++;
    }
}

module.exports = task;