export default class Project {
    constructor(title) {
        this.title = title;
        this.tasks = [];
        this.id = crypto.randomUUID();
    }
    addTask(taskObject) {
        this.tasks.push(taskObject);
    }
    deleteTask(id) {
        for (let task of this.tasks) {
            if (task.id == id) {
                const index = this.tasks.indexOf(task);
                this.tasks.splice(index, 1);
                return;
            }
        } 
    }
    getTasks() {
        return this.tasks;
    }
}