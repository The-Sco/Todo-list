import Project from "./modules/project.js";
import TaskItem from "./modules/task.js";
import TodoController from "./modules/todoController.js";
import DisplayController from "./ui/displayController.js";
import { openDialogWindow } from "./modules/functions.js";
import style from "./style.css";

const main = document.querySelector("main");
const body = document.querySelector("body");

const selectedThemeData = localStorage.getItem("theme");
const selectedTheme = JSON.parse(selectedThemeData);

if (selectedTheme) body.dataset.theme = selectedTheme;
else {
    body.dataset.theme = "light";
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) body.dataset.theme = "dark";
}

const todoController = new TodoController();
const displayController = new DisplayController(todoController);

document.addEventListener("DOMContentLoaded", () => {
    displayController.renderTaskCards()
});

displayController.renderTaskCards();
displayController.renderProjects();


const dialogWindow = document.querySelector("#dialogWindow");
const dialogForm = document.querySelector("#dialog-form");
const addTaskbutton = document.querySelector("#action-newTask");

addTaskbutton.addEventListener("click", () => { 
    openDialogWindow("task");
    const dialogTask = dialogWindow.querySelector(".dialog-form");
    dialogTask.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskTitle = dialogTask.querySelector("#dialog__content-input-title").value;
        const taskDescription = dialogTask.querySelector("#dialog__content-input-description").value;
        const taskPriority = dialogTask.querySelector("input[name='priority']:checked").value;
        const dueDate = dialogTask.querySelector("#dialog__content-input-date").value;
        
        const task = new TaskItem(taskTitle, taskDescription, taskPriority, dueDate);
        todoController.selectedProject.addTask(task); 
        todoController.saveProjects();  
        dialogWindow.close();
        displayController.renderTaskCards();
        dialogWindow.innerHTML = "";
    })
});

const addProjectButton = document.querySelector("#action-newProject");
addProjectButton.addEventListener("click", () => {
    openDialogWindow("project");
    const dialogProject = dialogWindow.querySelector(".dialog-form");
    dialogProject.addEventListener("submit", (e) => {
        e.preventDefault();
        main.dataset.mode = "project";
        const projectTitle = dialogProject.querySelector("#dialog__content-input-title").value;

        const project = new Project(projectTitle);
        todoController.addProject(project);
        todoController.saveProjects();
        dialogWindow.close();
        displayController.renderTaskCards();
        displayController.renderProjects();
        displayController.toggleAddTaskButton();
        dialogWindow.innerHTML = "";
    })
});

function loadFiltredTasks(tasks, title) {
    main.dataset.filter = title;
    main.dataset.mode = "filter";
    displayController.renderTaskCards(tasks, title);
    displayController.toggleAddTaskButton();
}

const showAllTasksButton = document.querySelector(".filter-allTasks");
showAllTasksButton.addEventListener("click", () => {
    const allTasks = todoController.sorter.getAllTasks();
    loadFiltredTasks(allTasks, "All tasks");
})
const showTodayTasksButton = document.querySelector(".filter-today");
showTodayTasksButton.addEventListener("click", () => {
    const todayTasks = todoController.sorter.getTodayTasks();
    loadFiltredTasks(todayTasks, "Today");
});

const showTomorrowTasksButton = document.querySelector(".filter-tomorrow");
showTomorrowTasksButton.addEventListener("click", () => {
    const tomorrowTasks = todoController.sorter.getTomorrowTasks();
    loadFiltredTasks(tomorrowTasks, "Tomorrow");
});

const showWeekTasksButton = document.querySelector(".filter-week");
showWeekTasksButton.addEventListener("click", () => {
    const weekTasks = todoController.sorter.getThisWeekTasks();
    loadFiltredTasks(weekTasks, "This week");
});

const changeThemeButton = document.querySelector("#action-changeTheme");
changeThemeButton.addEventListener("click", () => {
    const theme = body.dataset.theme;
    if (theme == "dark") {
        body.dataset.theme = "light";
    } else {
        body.dataset.theme = "dark";
    }
    localStorage.setItem("theme", JSON.stringify(body.dataset.theme));
})

const burgerMenuButton = document.querySelector(".burgerMenu-button");
const sideBar = document.querySelector(".sidebar");

burgerMenuButton.addEventListener("click", () => {
    sideBar.classList.toggle("active");
})

sideBar.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
        sideBar.classList.remove("active");
    }
})