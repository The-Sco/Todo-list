import { format } from "date-fns";
import TaskItem from "./task";
import Project from "./project";
import Sorter from "../services/sorting";

export default class TodoController {
    constructor() {
        this.selectedProject = null
        this.nullProject = new Project("No Projects!");
        const savedData = localStorage.getItem("todoData");
        if (savedData && savedData != "[]") {
            this.projects = this.restoreProjects(JSON.parse(savedData));
            this.selectedProject = this.projects[0];
        } else {
            this.projects = [];
            this.createDefaultContent();
        }
        this.sorter = new Sorter(this);
    }

    addProject(projectObject) {
        for (let project of this.projects) {
            if (projectObject.title === project.title) {
                alert("Project with this name already exists!");
                return;
            }
        }
        this.projects.push(projectObject);
        this.selectedProject = projectObject;
        this.saveProjects();
        return;
    }

    deleteProject(id) {
        for (let project of this.projects) {
            if (project.id == id) {
                const index = this.projects.indexOf(project);
                this.projects.splice(index, 1);
                this.saveProjects();
                return;
            }
        } 
    }

    saveProjects() {
        localStorage.setItem("todoData", JSON.stringify(this.projects));
    }

    updateProjects() {
        if (document.querySelector("main").dataset.mode !== "filter") {
            if (this.projects.includes(this.selectedProject)) return;
            else if (this.projects.length == 0) this.loadNullProject();
            else this.selectedProject = this.projects[this.projects.length-1];
        }
        return;
    }

    getProjects() {
        return this.projects;
    }

    selectProject(id) {
        for (let project of this.projects) {
            if (id === project.id) {
                this.selectedProject = project;
                return;
            }
        }
    }

    restoreProjects(data) {
        return data.map((projectData) => {
            const project = new Project(projectData.title);
            
            projectData.tasks.forEach((taskData) => {
                const task = new TaskItem(
                    taskData.title,
                    taskData.description,
                    taskData.priority,
                    taskData.dueDate,
                )
                task.status = taskData.status;
                project.addTask(task);
            })
            return project;
        })
    }

    createDefaultContent() {
        const d = new Date();
        function formatDate(d) {
            const type = "yyyy-MM-dd";
            const date = format(d, type);
            return date;
        }

        const project1 = new Project("Plans");
        const task1 = new TaskItem("Learn SOLID principles", "hi", "2", formatDate(d));
        const task2 = new TaskItem("Finish todo list", "^_^", "1", formatDate(d));

        d.setDate(d.getDate()+1);
        const task3 = new TaskItem("Cook a dinner", "I want to cook a salad!", "1", formatDate(d));
        
        d.setDate(d.getDate()+1);
        const task4 = new TaskItem("Pet my cat", "Meow! :3", "3", formatDate(d));

        project1.addTask(task1);
        project1.addTask(task2);
        project1.addTask(task3);
        project1.addTask(task4);
        
        this.addProject(project1);
        return;
    }

    loadNullProject() {
        document.querySelector("main").dataset.mode = "null";
        this.selectedProject = this.nullProject;
        return;
    }
}