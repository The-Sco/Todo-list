export default class TaskItem {
        constructor(title, description, priority, dueDate) {
            this.title = title;
            this.description = description;
            this.priority = priority;
            this.dueDate = dueDate;
            this.status = false;
            this.id = crypto.randomUUID();
        }
        toggleStatus() {
            this.status = !this.status;
        }
        formatPriority() {
            switch(this.priority) {
                case "1": 
                    return "Low";
                    break;
                case "2":
                    return "Medium";
                    break;
                case "3":
                    return "High";
                    break;
            }
        }
}