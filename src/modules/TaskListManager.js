class TaskListManager {
  constructor() {
    // TODO: Fetch tasks from the localstorage and if there is none
    // then, fill the tasks with empty array.
    this.tasks = [];
  }

  // We're isolatting task definition here so we don't need to
  // look anywhere else to find what is what.
  add(title, description, date, priority) {
    this.tasks.push({
      title,
      description,
      date,
      priority,
      completed: false,
    });
  }
}

export default TaskListManager;