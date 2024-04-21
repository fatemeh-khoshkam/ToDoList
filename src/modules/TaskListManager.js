class TaskListManager {
  constructor(render) {
    // Fetch tasks from the localstorage and if there is none
    // then, fill the tasks with empty array.
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks !== "undefined" && storedTasks !== null) {
      this.tasks = JSON.parse(localStorage.getItem("tasks")).tasks;
    } else {
      this.tasks = [];
    }
    this.render = render;
    this.render(this);
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
    this.render(this);
  }

  remove(id) {
    this.tasks.splice(id, 1);
    this.render(this);
  }

  edit(id, title, description, date, priority) {
    this.tasks[id].title = title;
    this.tasks[id].description = description;
    this.tasks[id].date = date;
    this.tasks[id].priority = priority;

    this.render(this);
  }

  toggleTask(id, input) {
    this.tasks[id].completed = input.checked;
  }
}

export default TaskListManager;
