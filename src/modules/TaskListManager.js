class TaskListManager {
  constructor(render) {
    // Fetch tasks from the localstorage and if there is none
    // then, fill the tasks with empty array.
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks && storedTasks !== "undefined") {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        this.tasks = Array.isArray(parsedTasks.tasks) ? parsedTasks.tasks : [];
      } catch (e) {
        console.error("Error parsing tasks:", e);
        this.tasks = [];
      }
    } else {
      this.tasks = [];
    }
    this.render = render;
    this.render(this);

    console.log("Tasks before storing:", this.tasks);
    this.storeTasksInLocalStorage();
  }

  storeTasksInLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify({ tasks: this.tasks }));
    console.log("Tasks after storing:", localStorage.getItem("tasks"));
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
    this.storeTasksInLocalStorage();
    console.log(this.tasks);
    this.render(this);
  }

  remove(id) {
    this.tasks.splice(id, 1);
    console.log(this.tasks);

    this.storeTasksInLocalStorage();
    this.render(this);
  }

  edit(id, title, description, date, priority) {
    this.tasks[id].title = title;
    this.tasks[id].description = description;
    this.tasks[id].date = date;
    this.tasks[id].priority = priority;
    this.storeTasksInLocalStorage();
    this.render(this);
  }

  toggleTask(id, input) {
    this.tasks[id].completed = input.checked;
    this.storeTasksInLocalStorage();
    this.render(this);
  }
}

export default TaskListManager;
