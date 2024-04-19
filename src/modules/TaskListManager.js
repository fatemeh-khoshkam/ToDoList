class TaskListManager {
  constructor() {
    // Fetch tasks from the localstorage and if there is none
    // then, fill the tasks with empty array.
    const localStorageTasks = JSON.parse(localStorage.getItem("tasks"));

    if (localStorageTasks) {
      this.tasks = localStorageTasks.tasks;
    } else {
      this.tasks = [];
    }
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

  remove(id) {
    this.tasks.splice(id, 1);
  }

  edit(id, title, description, date, priority) {
    this.tasks[id].title = title;
    this.tasks[id].description = description;
    this.tasks[id].date = date;
    this.tasks[id].priority = priority;
  }
}

export default TaskListManager;
