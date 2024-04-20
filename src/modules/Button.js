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
  constructor(action, modal, taskCards, storeInLocal) {
    super(action, modal);
    this.taskCards = taskCards;
    this.storeInLocal = storeInLocal;
  }

  onClick(event) {
    this.modal.show(() => {
      const cardID = event.target.dataset.id;
      console.log(event);
      //console.log(id);
      this.taskCards.remove(cardID);
      this.storeInLocal();
    });
  }
}

class EditButton extends Button {
  constructor(action, modal, taskCards, storeInLocal, getFormTask) {
    super(action, modal);
    this.taskCards = taskCards;
    this.storeInLocal = storeInLocal;
    this.getFormTask = getFormTask;
  }

  onClick(event) {
    const cardID = event.target.dataset.id;
    console.log(event);
    console.log(this.taskCards);
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
      this.storeInLocal();
    });
  }
}

export { DeleteButton, EditButton };
