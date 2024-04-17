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
  constructor(action, modal, taskCards, renderTasks) {
    super(action, modal);
    this.taskCards = taskCards;
    this.renderTasks = renderTasks;
  }

  onClick(event) {
    this.modal.show(() => {
      //console.log(event.target);
      const cardID = event.target.dataset.id;
      console.log("ID of card we want delete : ", cardID);
      console.log("taskCards before Render: ", this.taskCards);
      this.taskCards.splice(cardID, 1);
      this.renderTasks();
    });
  }
}

export default DeleteButton;
