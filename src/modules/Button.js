class Button {
  constructor(action, modal) {
    this.buttons = document.querySelectorAll(action);
    this.modal = modal;
    this.addEventListeners();
  }

  addEventListeners() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", (event) => this.onClick(event));
    });
  }

  onClick(event) {
    // This method should be overridden by other classes
    console.error("onClick not implemented");
  }
}

class DeleteButton extends Button {
  constructor(action, modal, taskCards, renderTasks, storeTaskInLocal) {
    super(action, modal);
    this.taskCards = taskCards;
    this.renderTasks = renderTasks;
    this.storeTaskInLocal = storeTaskInLocal;
  }

  onClick(event) {
    this.modal.show(() => {
      const cardID = event.target.dataset.id;
      this.taskCards.remove(cardID);
      this.storeTaskInLocal(this.taskCards);
      this.renderTasks();
    });
  }
}

class EditButton extends Button {
  constructor(
    action,
    modal,
    taskCards,
    renderTasks,
    getFormTask,
    storeTaskInLocal
  ) {
    super(action, modal);
    this.taskCards = taskCards;
    this.renderTasks = renderTasks;
    this.getFormTask = getFormTask;
    this.storeTaskInLocal = storeTaskInLocal;
  }

  onClick(event) {
    const cardID = event.target.dataset.id;
    if (!this.taskCards.tasks[cardID]) return;

    Object.entries(this.taskCards.tasks[cardID]).forEach(([key, value]) => {
      const input = document.querySelector(`.${key}`);
      if (input) {
        input.value = value;
      }
    });

    this.modal.show(() => {
      const { title, description, date, priority } = this.getFormTask();
      this.taskCards.edit(cardID, title, description, date, priority);
      this.storeTaskInLocal(this.taskCards);
      this.renderTasks();
    });
  }
}

export { DeleteButton, EditButton };
