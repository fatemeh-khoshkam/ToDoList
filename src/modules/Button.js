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
      this.taskCards.splice(cardID, 1);
      this.storeTaskInLocal(this.taskCards);
      this.renderTasks();
    });
  }
}

class EditButton extends Button {
  constructor(action, modal, taskCards, renderTasks, getFormTask) {
    super(action, modal);
    this.taskCards = taskCards;
    this.renderTasks = renderTasks;
    this.getFormTask = getFormTask;
  }

  onClick(event) {
    const cardID = event.target.dataset.id;
    if (!this.taskCards[cardID]) return;

    Object.entries(this.taskCards[cardID]).forEach(([key, value]) => {
      const input = document.querySelector(`.${key}`);
      if (input) {
        input.value = value;
      }
    });

    this.modal.show(() => {
      this.taskCards[cardID] = this.getFormTask();
      this.renderTasks();
    });
  }
}

export { DeleteButton, EditButton };
