class TaskListManager {
  constructor(render) {
    // Fetch tasks from the localstorage and if there is none
    // then, fill the tasks with empty array.

    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks !== "undefined" && storedTasks !== null) {
      try {
        this.tasks = JSON.parse(storedTasks);
      } catch (e) {
        console.error("Error parsing tasks from localStorage:", e);
        this.tasks = [];
      }
    } else {
      console.log(1);
      this.tasks = [];
    }

    // if (localStorageTasks) {
    //   this.tasks = localStorageTasks.tasks;
    // } else {
    //   this.tasks = [];
    // }
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
}

export default TaskListManager;
