import { createElement } from "../modules/functions";

export default class DisplayController {
    constructor(todo) {
        this.todo = todo;
    }

    clearContainer(container) {
        container.innerHTML = "";
    }

    toggleAddTaskButton() {
        const main = document.querySelector("main");
        const button = main.querySelector("#action-newTask");

        if (main.dataset.mode !== "project") button.disabled = true;
        else button.disabled = false;
    }

    changeActiveNavButton(clickedButton) {
        const buttons = document.querySelectorAll(".nav-button");
        buttons.forEach((button) => {
            button.classList.remove("nav-button-active");
        })
        clickedButton.classList.add("nav-button-active");
        return;
    }
    
    addActiveStatusToSelectedProject() {
        if (document.querySelector("main").dataset.mode !== "project") return;
        const projectsButtons = document.querySelectorAll(".projects-nav .nav-button");
        projectsButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                console.log(button, e.target);
                this.changeActiveNavButton(e.target);
            })
        })
        return;
    }

    addActiveButtonChangingToFilters() {
        const navButtons = document.querySelectorAll(".nav-button");
        navButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                this.changeActiveNavButton(e.target);
            })
        })
    }

    editTask(expandedDiv, task) {
        const title = expandedDiv.querySelector("#task-expanded__input-title").value;
        const description = expandedDiv.querySelector("#task-expanded__input-description").value;
        const priority = expandedDiv.querySelector("input[name='priority']:checked").value;
        const dueDate = expandedDiv.querySelector("#task-expanded__input-date").value;

        task.title = title;
        task.description = description;
        task.priority = priority;
        task.dueDate = dueDate;
    }

    updateTaskCard(taskDiv, task) {
        const taskInfo = taskDiv.querySelector(".task-info");
        
        taskInfo.querySelector(".task-content").innerHTML =
        `<div class="task-titleDiv">
            <h4 class="task-title"></h4>
        </div>
        <div class="task-dueDateDiv task-innerDiv">
            <p class="task-label">Due date:</p>
            <p class="task-dueDate"></p>
        </div>
        <div class="task-priorityDiv task-innerDiv">
            <div class="task-priority-innerDiv task-priorityDiv-${task.formatPriority()}">
                <p class="task-priority"></p>
            </div>
        </div>`;

        if (!task.dueDate) taskDiv.querySelector(".task-dueDateDiv").style.display = "none";

        taskInfo.querySelector(".task-title").textContent = task.title;
        taskInfo.querySelector(".task-dueDate").textContent = task.dueDate;
        taskInfo.querySelector(".task-priority").textContent = task.formatPriority();
    }

    closeExpanded() {
        document.querySelectorAll(".taskDiv").forEach((task) => {
            const expanded = task.querySelector(".task-expandDiv");
            if (expanded) task.removeChild(expanded);
        })
    }

    expandCard(taskDiv, task) {
        taskDiv.classList.add("task-expanded");
        taskDiv.appendChild(createElement("div", "task-expandDiv"));
        const expandDiv = taskDiv.querySelector(".task-expandDiv");
        expandDiv.innerHTML = 
        `<form class="task-expanded__form">
            <div class="task-expanded__leftDiv">
                <div class="task-expanded__inputDiv">
                    <label class="task-expanded-label" for="task-expanded__input-title">Title</label>
                    <input class="task-expanded__input-title" id="task-expanded__input-title" type="text" required>
                </div>
                <div class="task-expanded__inputDiv">
                    <label class="task-expanded-label" for="task-expanded__input-description">Description</label>
                    <textarea class="task-expanded__input-description" id="task-expanded__input-description" rows="8"></textarea>
                </div>
            </div>
            <div class="task-expanded__rightDiv">
                <div class="task-expanded__priorityDiv">
                    <div class="priorityDiv-title">
                        <span>Priority</span>
                    </div>
                    <div class="task-expanded__radioInputsDiv">
                        <div class="task-expanded__radioInputDiv radioInputDiv">
                            <input class="task-expanded__radioInput radioInput priority-low" id="task-expanded__radioInput-low" type="radio" name="priority" value="1">
                            <label class="task-expanded-label" for="task-expanded__radioInput-low">Low</label>
                        </div>
                        <div class="task-expanded__radioInputDiv radioInputDiv">
                            <input class="task-expanded__radioInput radioInput priority-medium" id="task-expanded__radioInput-medium" type="radio" name="priority" value="2">
                            <label class="task-expanded-label" for="task-expanded__radioInput-medium">Medium</label>
                        </div>
                        <div class="task-expanded__radioInputDiv radioInputDiv">
                            <input class="task-expanded__radioInput radioInput priority-high" id="task-expanded__radioInput-high" type="radio" name="priority" value="3">
                            <label class="task-expanded-label" for="task-expanded__radioInput-high">High</label>
                        </div>
                    </div>
                </div>
                <div class="task-expanded__dateInputDiv">
                    <label class="task-expanded-label" for="task-expanded__input-date">Due date</label>
                    <input class="task-expanded__input-date dateInput" id="task-expanded__input-date" type="date" value="${task.dueDate}">
                </div>
                <div class="task-expanded__buttonsDiv">
                    <button class="task-expanded__saveButton" type="submit">Save</button>
                    <button class="task-expanded__cancelButton" type="button">Cancel</button>
                </div>
            </div>
        </form>`;

        expandDiv.querySelector("#task-expanded__input-title").value = task.title;
        expandDiv.querySelector("#task-expanded__input-description").textContent = task.description;

        const radioInputs = taskDiv.querySelectorAll(".task-expanded__radioInput");
        radioInputs.forEach((radio) => {
            if (radio.value == task.priority) radio.checked = true;
        });

        const cancelButton = taskDiv.querySelector(".task-expanded__cancelButton");
        cancelButton.addEventListener("click", () => {
            taskDiv.classList.remove("task-expanded");
            this.closeExpanded();
        })

        const form = taskDiv.querySelector(".task-expanded__form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            taskDiv.classList.remove("task-expanded");
            this.editTask(expandDiv, task);
            this.updateTaskCard(taskDiv, task);
            this.closeExpanded();
            this.todo.saveProjects();
        })
    }

    createCard(task, onDelete) {
        const taskDiv = createElement("article", "taskDiv");
        taskDiv.appendChild(createElement("div", "task-info"));
        const taskInfo = taskDiv.querySelector(".task-info");
        
        taskInfo.appendChild(createElement("div", "task-completionStatusDiv",));
        
        const completionStatusDiv = taskInfo.querySelector(`.task-completionStatusDiv`);
        completionStatusDiv.appendChild(createElement("input", "task-completionStatus"));
        const completionStatus = taskInfo.querySelector(".task-completionStatus");
        completionStatus.type = "checkbox";
        completionStatus.name = "Completion status"
        if (task.status) {
            taskDiv.classList.add("taskDiv-completed")
            completionStatus.checked = true;
        }
        completionStatus.addEventListener("click", () => {
            task.toggleStatus();
            this.todo.saveProjects();
            if (task.status) taskDiv.classList.add("taskDiv-completed");
            else taskDiv.classList.remove("taskDiv-completed");
        })
        
        if (taskInfo.hover === true) console.log("hover");

        taskInfo.appendChild(createElement("div", "task-content"));
        taskInfo.querySelector(".task-content").addEventListener("click", () => {
            this.closeExpanded();
            if (taskDiv.className.includes("task-expanded")) { 
                taskDiv.classList.remove("task-expanded");
                this.closeExpanded();
                return;
            }
            this.expandCard(taskDiv, task);
        })
        taskInfo.querySelector(".task-content").innerHTML =
        `<div class="task-titleDiv">
            <h4 class="task-title"></h4>
        </div>
        <div class="task-dueDateDiv task-innerDiv">
            <p class="task-label">Due date:</p>
            <p class="task-dueDate"></p>
        </div>
        <div class="task-priorityDiv task-innerDiv">
            <div class="task-priority-innerDiv task-priorityDiv-${task.formatPriority()}">
                <p class="task-priority"></p>
            </div>
        </div>`;
        if (!task.dueDate) taskDiv.querySelector(".task-dueDateDiv").style.display = "none";

        taskInfo.querySelector(".task-title").textContent = task.title;
        taskInfo.querySelector(".task-dueDate").textContent = task.dueDate;
        taskInfo.querySelector(".task-priority").textContent = task.formatPriority();

        taskInfo.appendChild(createElement("div", "task-deleteButtonDiv"));
        taskInfo.querySelector(".task-deleteButtonDiv").appendChild(createElement("a", "task-deleteButton deleteButton"));
        const deleteButton = taskInfo.querySelector(".task-deleteButton");
        deleteButton.href = "#delete";
        deleteButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
        deleteButton.addEventListener("click", onDelete)

        return taskDiv;
    }
    renderTaskCards(tasks=this.todo.selectedProject.getTasks(), title=this.todo.selectedProject.title) {
        location.hash = `#${title}`;
        document.querySelector("#current-project").textContent = title;
        const tasksContainer = document.querySelector(".tasks-container");
        this.clearContainer(tasksContainer);

        if (tasks.length == 0) return;
        tasks.forEach(taskItem => {
            const onDelete = () => {
                this.todo.selectedProject.deleteTask(taskItem.id);
                this.todo.saveProjects();
                this.renderTaskCards();
            }
            const taskCard = this.createCard(taskItem, onDelete);
            tasksContainer.appendChild(taskCard);
        })
    }

    updateCards() {
        const mode = document.querySelector("main").dataset.mode;
        if (mode !== "filter") this.renderTaskCards();
        else if(mode == "filter") {
            const filter = document.querySelector("main").dataset.filter;
            let tasks = [];
            let title = "";
            switch(filter) {
                case "All tasks":
                    tasks = this.todo.sorter.getAllTasks();
                    title = "All tasks";
                    break;
                case "Today":
                    tasks = this.todo.sorter.getTodayTasks();
                    title = "Today";
                    break;
                case "Tomorrow":
                    tasks = this.todo.sorter.getTomorrowTasks();
                    title = "Tomorrow";
                    break;
                case "This week":
                    tasks = this.todo.sorter.getThisWeekTasks();
                    title = "This week";
            }
            this.renderTaskCards(tasks, title);
        }
    }

    createProject(project, onClick, onDelete) {
        const li = document.createElement("li");
        li.appendChild(createElement("a", "nav-button", project.id));

        const projectButton = li.querySelector(".nav-button");
        projectButton.href = `#${project.title}`;
        projectButton.textContent = project.title;
        projectButton.addEventListener("click", onClick);

        li.appendChild(createElement("a", "project-deleteButton deleteButton"));
        const deleteButton = li.querySelector(".project-deleteButton");
        deleteButton.href = "#delete";
        deleteButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;

        li.querySelector(".project-deleteButton").addEventListener("click", onDelete);
        return li;
    }
    renderProjects() {
        const projectsContainer = document.querySelector(".projects__nav-list");
        this.clearContainer(projectsContainer);
        const projects = this.todo.getProjects();
        for (let project of projects) {
            const onDelete = () => {
                this.todo.deleteProject(project.id);
                this.todo.updateProjects();
                this.todo.saveProjects();
                this.updateCards();
                this.renderProjects();
                this.toggleAddTaskButton();
            }
            const onClick = () => {
                console.log("click project");
                document.querySelector("main").dataset.mode = "project";
                this.toggleAddTaskButton();
                this.todo.selectProject(project.id);
                this.renderTaskCards();
            }
            const projcetButton = this.createProject(project, onClick, onDelete);
            projectsContainer.appendChild(projcetButton);
        }
    }
}