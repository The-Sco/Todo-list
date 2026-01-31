import { isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';

export default class Sorter {
    constructor(todo) {
        this.todo = todo;
    }
    getAllTasks() {
        const tasks = []; 
        this.todo.projects.forEach((project) => {
            project.getTasks().forEach((task) => tasks.push(task));
        })
        return tasks;
    }
    getTodayTasks() {
        const allTasks = this.getAllTasks();
        const todayTasks = [];
        allTasks.forEach((task) => {
            const taskDueDate = parseISO(task.dueDate);
            if (isToday(taskDueDate)) todayTasks.push(task);
        })
        return todayTasks;
    }
    getTomorrowTasks() {
        const allTasks = this.getAllTasks();
        const tomorrowTasks = [];
        allTasks.forEach((task) => {
            const taskDueDate = parseISO(task.dueDate);
            if (isTomorrow(taskDueDate)) tomorrowTasks.push(task);
        })
        return tomorrowTasks;
    }
    getThisWeekTasks() {
        const allTasks = this.getAllTasks();
        const thisThisWeekTasks = [];
        allTasks.forEach((task) => {
            const taskDueDate = parseISO(task.dueDate);
            if (isThisWeek(taskDueDate, { weekStartsOn: 1 })) thisThisWeekTasks.push(task);
        })
        return thisThisWeekTasks;
    }
}