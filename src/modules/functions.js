export function createElement(tag, classes="", id="", text="") {
    const element = document.createElement(tag);
    if (classes) element.className = classes;
    if (id) element.id = id;
    if (text) element.textContent = text;
    return element;
}

function loadNewTaskDialog() {
    const dialogContent = document.querySelector(".dialog-content")
    dialogContent.innerHTML =
    `<div class="dialog__content-titleDiv">
        <h3 class="dialog__content-title">New task</h3>
    </div>
    <div class="dialog__content-inputsDiv">
        <div class="dialog-inputDiv">
            <label class="dialog__content-label" for="dialog__content-input-title">Title*</label>
            <input class="dialog__content-input" id="dialog__content-input-title" type="text" maxlength="36" required>
        </div>
        <div class="dialog-inputDiv">
            <label class="dialog__content-label" for="dialog__content-input-description">Description</label>
            <textarea class="dialog__content-input" id="dialog__content-input-description" rows="6"></textarea>
        </div>
        <div class="dialog__content-priorityDiv">
            <span class="dialog__content-label">Priority*</span>
            <div class="dialog__content-radioInputsDiv">
                <div class="dialog__content-radioInputDiv radioInputDiv">
                    <input class="dialog__content-radio radioInput priority-low" id="dialog__content-radio-low" name="priority" type="radio" value="1" checked>
                    <label class="dialog__content-label" for="dialog__content-radio-low">Low</label>
                </div>
                <div class="dialog__content-radioInputDiv radioInputDiv">
                    <input class="dialog__content-radio radioInput priority-medium" id="dialog__content-radio-medium" name="priority" type="radio" value="2">
                    <label class="dialog__content-label" for="dialog__content-radio-medium">Medium</label>
                </div>
                <div class="dialog__content-radioInputDiv radioInputDiv">
                    <input class="dialog__content-radio radioInput priority-high" id="dialog__content-radio-high" name="priority" type="radio" value="3">
                    <label class="dialog__content-label" for="dialog__content-radio-high">High</label>
                </div>
            </div>
        </div>
        <div class="dialog-inputDiv">
            <label class="dialog__content-label" for="dialog__content-input-date">Due date</label>
            <input class="dialog__content-date" id="dialog__content-input-date" type="date">
        </div>
    </div>`;
}

function loadNewProjectDialog() {
    const dialogContent = document.querySelector(".dialog-content");
    dialogContent.innerHTML = 
    `<div class="dialog__content-titleDiv">
        <h3 class="dialog__content-title">New project</h3>
    </div>
    <div class="dialog__content-inputsDiv">
        <div class="dialog-inputDiv">
            <label class="dialog__content-label" for="dialog__content-input-title">Title*</label>
            <input class="dialog__content-input" id="dialog__content-input-title" type="text" maxlength="30" required>
        </div>
    </div>
    `;
}

export function openDialogWindow(mode) {
    const dialog = document.querySelector("#dialogWindow");
    dialog.innerHTML = 
    `<form class="dialog-form" id="dialog-form">
        <div class="dialog-content"></div>
        <div class="dialog-buttonsDiv">
            <button class="dialog-button" id="dialog-submit" type="submit">Create</button>
            <button class="dialog-button" id="dialog-cancel" type="button">Cancel</button>
        </div>
    </form>`;

    dialog.querySelector("#dialog-form").dataset.mode = mode;

    switch(mode) {
        case "task":
            loadNewTaskDialog();
            break;
        case "project":
            loadNewProjectDialog();
            break;
    }

    dialog.showModal();
    document.querySelector("#dialog-cancel").addEventListener("click", () => {
        dialog.close();
        dialog.innerHTML = "";
    })
}