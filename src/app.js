import Modal from "./modules/Modal.js";
import { DeleteButton, EditButton } from "./modules/Button.js";

/// Toggle Menu
const btnOpenMenu = document.querySelector(".btn-open-menu");
const btnCloseMenu = document.querySelector(".btn-close-menu");
const aside = document.querySelector("aside");
const header = document.querySelector("header");
const main = document.querySelector("main");
const body = document.querySelector("body");

btnOpenMenu.addEventListener("click", (event) => {
  event.stopPropagation();

  aside.classList.remove("closed");
  body.classList.add("pointer-events-none", "overflow-hidden");
  aside.classList.add("pointer-events-auto");
});

btnCloseMenu.addEventListener("click", (event) => {
  aside.classList.add("closed");
  body.classList.remove("pointer-events-none", "overflow-hidden");
});

aside.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", (event) => {
  aside.classList.add("closed");
  body.classList.remove("pointer-events-none", "overflow-hidden");
});

/// Toggle theme (dark mode)
const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
const themeToggleBtn = document.getElementById("theme-toggle");

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

themeToggleBtn.addEventListener("click", function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

const dashboardContainer = document.querySelector("#dashboardContainer");
const submitFormBtn = document.querySelector(".submitFormBtn");
const closeBtns = document.querySelectorAll(".closeBtn");
const formTask = document.querySelector("#newTaskForm");
const addNewTask = document.querySelectorAll(".addNewTask");
const taskContainer = document.querySelector("#taskContainer");
let formInputs = formTask.querySelectorAll("input, select, textarea");
const messagesContainer = document.querySelector("#messagesContainer");
const allTasks = document.querySelector(".allTasks");
const dashboard = document.querySelector(".dashboard");
const newTaskModal = document.querySelector("#newTask");
const actionState = document.querySelector(".action");

const alertMessage = document.querySelector("#alertModal");
const alertModal = new Modal(alertMessage);
alertModal.init();
const formTaskModal = new Modal(newTaskModal);
formTaskModal.init();
let taskCards = [];

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  actionState.value = "";
  loadTasksFromLocalStorage();
  taskContainer.style.display = "none";
});

// Generates task buttons based on 3 factors: color , button name , icon
const actionBtn = (name, color, d, dataID) => {
  return `<a
  href="#"
  data-id="${dataID}"
  class="${name.toLowerCase()}Btn flex flex-row items-center text-${color}-600 font-medium"
  >
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-5 h-5"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="${d}"
    />
  </svg>

  ${name}</a
  >`;
};

// Edit button creates from "actionBtn" function
const editBtn = (id) =>
  actionBtn(
    "Edit",
    "green",
    "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
    id
  );

// Delete button creates from "actionBtn" function
const deleteBtn = (id) =>
  actionBtn(
    "Delete",
    "red",
    "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
    id
  );
// Clear all input values
const clearFields = (inputs) => {
  inputs.forEach((input) => {
    input.value = "";
  });
};

// 1. Close modal of create task
// 2. Clear Input values of Task form after 1 second
const closeModal = () => {
  formTaskModal.hide();
  setTimeout(clearFields(formInputs), 1000);
};

// Give a color name based on level priority
const priorityLevel = (level) => {
  // return {
  //   Low: "green",
  //   Meduim: "amber",
  //   High: "red",
  // }[level];

  if (level === "Low") return "green";
  if (level === "Meduim") return "amber";
  if (level === "High") return "red";
};

// 1. Get the value of each field input in the form and store them in an object
// 2. Show special Error message if inputs are not filled
// 3. return Object which has 4 property based on user filled on task form

const getFormTask = () => {
  const fields = ["title", "description", "date", "priority", "completed"];
  const taskObj = {};

  for (let field of fields) {
    if (field === "completed") {
      taskObj[field] = false;
    } else {
      const value = document.querySelector(`.${field}`).value.trim();
      console.log(value);

      if (!value) {
        throw `${field}`;
      }
      taskObj[field] = value;
    }
  }

  console.log(taskObj);
  return taskObj;
};

// Return TASK Card base on : title, description, date, priority
const displayTask = (title, description, date, priority, dataID) => {
  let priorityClr = priorityLevel(priority);
  taskContainer.style.display = "flex";
  return `<div
  class="card cursor-pointer w-full shadow-md border-l-8 dark:shadow-[2px_2px_4px_0px_rgba(0,0,0,0.32)] dark:bg-night-light border-${priorityClr}-600 bg-white overflow-hidden sm:rounded-md mx-auto"
>
  <div class="px-4 py-5 sm:px-6">
    <div class="flex items-center justify-between">
      <label class="flex items-center cursor-pointer ">
          <input type="checkbox" class="peer w-5 h-5 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded-lg border border-slate-300">
          <span class="titleInfo peer-checked:line-through select-none info pl-3 text-xl font-medium text-gray-800 dark:text-night-silver" >
          ${title}
          </span>
          <span class="peer-checked:inline-flex hidden ml-3 items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Completed</span>
      </label>

      <p  class="text-sm font-medium text-gray-500">
        Priority: <span class="info text-${priorityClr}-600">${priority}</span>
      </p>

    </div>
    <div class="mt-2 flex items-end justify-between">
      <div>
      <p  class="text-xs text-gray-500 text-semibold">Schelued:
        <span  class="info">
          ${date}</span
        ></p>
        <p  class="info mt-1 max-w-2xl text-md text-gray-600">
          ${description}
        </p>
      </div>
      <div class="flex flex-row gap-3">
        ${editBtn(dataID)}
        ${deleteBtn(dataID)}
      </div>
    </div>
  </div>
</div>`;
};

// Showing task form and closing side menu
addNewTask.forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    clearFields(formInputs);
    actionState.value = "create";
    aside.classList.add("closed");
    formTaskModal.show(() => {
      try {
        const task = getFormTask();
        taskCards.push(task);
        chkTasksExisting(taskCards);
        storeTasksInLocalStorage(taskCards);
        renderTasks();
      } catch (field) {
        throw field;
      }
    });
  });
});

closeBtns.forEach((btn) => {
  btn.addEventListener("click", closeModal);
});

// Showing tasks container and hiding dashboard
allTasks.addEventListener("click", () => {
  dashboardContainer.style.display = "none";
  taskContainer.style.display = "flex";
  loadTasksFromLocalStorage();
});

// Showing dashboard and hiding tasks container
dashboard.addEventListener("click", () => {
  dashboardContainer.style.display = "block";
  taskContainer.style.display = "none";
});

const renderTasks = () => {
  // Clear tasks before rendering new ones
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.remove());

  taskCards.forEach((task, i) => {
    //errMessage.textContent = "";
    const { title, description, date, priority } = task;

    taskContainer.insertAdjacentHTML(
      "beforeend",
      displayTask(title, description, date, priority, i)
    );
  });

  chkTasksExisting(taskCards);

  const deleteButton = new DeleteButton(
    ".deleteBtn",
    alertModal,
    taskCards,
    renderTasks,
    storeTasksInLocalStorage
  );
  const editButton = new EditButton(
    ".editBtn",
    formTaskModal,
    taskCards,
    renderTasks,
    getFormTask,
    storeTasksInLocalStorage
  );
};

// Function to store tasks in local storage
const storeTasksInLocalStorage = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to retrieve tasks from local storage
const getTasksFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("tasks")) || [];
};

// Function to display tasks
const loadTasksFromLocalStorage = () => {
  const tasks = getTasksFromLocalStorage();
  chkTasksExisting(tasks);

  if (tasks.length > 0) {
    // Render the existing tasks on page load
    taskCards = tasks;
    renderTasks();
    doneTasks();
  }
};

const chkTasksExisting = (tasks) => {
  const errMessage = document.querySelector(".errMessage");
  if (tasks.length === 0) {
    errMessage.textContent = "You don't have any tasks yet 🙁";
    errMessage.style.display = "flex";
  } else {
    errMessage.textContent = "";
    errMessage.style.display = "none";
  }
};

const checkingDoneTasks = () => {};

const doneTasks = () => {
  const allChks = document.querySelectorAll(".card input[type='checkbox']");
  allChks.forEach((input) => {
    input.addEventListener("click", (event) => {
      const card = event.target.closest(".card");
      const titleOfTask = card.querySelector(".titleInfo").textContent.trim();

      taskCards.find((task) => {
        if (task.title === titleOfTask) {
          task["completed"] = true;

          console.log(task);
        }
      });
      storeTasksInLocalStorage(taskCards);
      // console.log(taskCards);
      // console.log(event.target.closest(".card"));
      // console.log(titleOfTask);
    });
  });
  console.log(allChks);
};
