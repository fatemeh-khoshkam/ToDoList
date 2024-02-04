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

/// new task Modal
const newTaskModal = document.querySelector("#newTask");
function modalHandler(val, modal) {
  if (val) {
    fadeIn(modal);
  } else {
    fadeOut(modal);
  }
}
function fadeOut(el) {
  el.style.opacity = 1;
  (function fade() {
    if ((el.style.opacity -= 0.1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}
function fadeIn(el, display) {
  el.style.opacity = 0;
  el.style.display = display || "flex";
  (function fade() {
    let val = parseFloat(el.style.opacity);
    if (!((val += 0.2) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

/// Add new task to html
const dashboardContainer = document.querySelector("#dashboardContainer");
const submitFormBtn = document.querySelector("#submitFormBtn");
const cancelFormBtn = document.querySelector("#cancelFormBtn");
const closeFormBtn = document.querySelector("#closeFormBtn");
const formTask = document.querySelector("#newTaskForm");
const addNewTask = document.querySelector("#addNewTask");
const taskContainer = document.querySelector("#taskContainer");
let formInputs = formTask.querySelectorAll("input, select, textarea");
const messagesContainer = document.querySelector("#messagesContainer");
const alertMessagessage = document.querySelector("#alertModal");
const allTasks = document.querySelector(".allTasks");
const dashboard = document.querySelector(".dashboard");
const cancelAlertBtn = document.querySelector("#cancelAlertBtn");
const deleteAlertBtn = document.querySelector("#deleteAlertBtn");

// Initialize Alert modal with false state
modalHandler(false, alertMessage);

// Generates task buttons based on 3 factors: color , button name , icon
const actionBtn = (name, color, d) => {
  return `<a
  id="${name.toLowerCase()}Btn"
  href="#"
  class="flex flex-row items-center text-${color}-600 font-medium"
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
const editBtn = actionBtn(
  "Edit",
  "green",
  "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
);

// Delete button creates from "actionBtn" function
const deleteBtn = actionBtn(
  "Delete",
  "red",
  "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
);

// Clear all input values
const clearFields = (inputs) => {
  inputs.forEach((input) => {
    input.value = "";
  });
};

// 1. Close modal of create task
// 2. Show Dashboard container and HIDE Create Task container
// 3. Clear Input values of Task form after 1 second
const closeModal = () => {
  dashboardContainer.style.display = "block";
  taskContainer.style.display = "none";
  modalHandler(false, newTaskModal);
  setTimeout(clearFields(formInputs), 1000);
};

// Give a color name based on level priority
const priorityLevel = (level) => {
  if (level === "Low") return "green";
  if (level === "Meduim") return "amber";
  if (level === "High") return "red";
};

// 1. Get the value of each field input in the form and store them in an object
// 2. Show special Error message if inputs are not filled
// 3. return Object which has 4 property based on user filled on task form
const createTask = () => {
  const fields = ["title", "description", "date", "priority"];
  const taskObj = {};

  for (let field of fields) {
    const value = document.getElementById(field).value.trim();
    if (!value) {
      displayMessage(`${field} is required.`, "red");
      return null;
    }
    taskObj[field] = value;
  }

  console.log(taskObj);
  closeTaskForm();
  return taskObj;
};

// Closing Task Form by hiding it and showing Dashboard Container
const closeTaskForm = () => {
  fadeOut(newTaskModal);
  setTimeout(clearFields(formInputs), 1000);
  dashboardContainer.style.display = "none";
};

// Return TASK Card base on : title, description, date, priority
const displayTask = (title, description, date, priority) => {
  let priorityClr = priorityLevel(priority);
  taskContainer.style.display = "flex";
  return `<div
  class="card cursor-pointer w-full shadow-md border-l-8 dark:shadow-[2px_2px_4px_0px_rgba(0,0,0,0.32)] dark:bg-night-light border-${priorityClr}-600 bg-white overflow-hidden sm:rounded-md mx-auto"
>
  <div class="px-4 py-5 sm:px-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg leading-6 font-medium text-gray-900  dark:text-night-silver">
        ${title}
      </h3>
      <p class="text-sm font-medium text-gray-500">
        Priority: <span class="text-${priorityClr}-600">${priority}</span>
      </p>
    </div>
    <div class="mt-2 flex items-end justify-between">
      <div>
        <span class="text-xs text-gray-500 text-semibold">
          Schelued: ${date}</span
        >
        <p class="mt-1 max-w-2xl text-md text-gray-600">
          ${description}
        </p>
      </div>
      <div class="flex flex-row gap-3">
        ${editBtn}
        ${deleteBtn}
      </div>
    </div>
  </div>
</div>`;
};

// Create a new Task and add it to the DOM
submitFormBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const task = createTask();

  if (task) {
    const {
      title: title,
      description: description,
      date: date,
      priority: priority,
    } = task;

    taskContainer.insertAdjacentHTML(
      "beforeend",
      displayTask(title, description, date, priority)
    );
  }
});

cancelFormBtn.addEventListener("click", closeModal);
closeFormBtn.addEventListener("click", closeModal);

// Showing task form and closing side menu
addNewTask.addEventListener("click", () => {
  aside.classList.add("closed");
  modalHandler(true, newTaskModal);
});

// Showing tasks container and hiding dashboard
allTasks.addEventListener("click", () => {
  dashboardContainer.style.display = "none";
  taskContainer.style.display = "flex";
});

// Showing dashboard and hiding tasks container
dashboard.addEventListener("click", () => {
  dashboardContainer.style.display = "block";
  taskContainer.style.display = "none";
});

// Returns a message notification
const messageUI = (txt, color) => {
  const message = `<div class="relative z-50 messageBox transition-opacity	 bg-${color}-100 border-t-4 border-${color}-600 rounded-b text-${color}-900 ml-3 mb-3 px-4 py-3 shadow-md" role="alert">
  <div class="flex">
    <div class="py-1"><svg class="fill-current h-6 w-6 text-${color}-600 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
    <div>
      <p class="font-bold">${txt}</p>
    </div>
  </div>
</div>`;
  return message;
};

// 1. Displays the notif message in HTML
// 2. Get the last message and remove all of them after 3 seconds
const displayMessage = (txt, color) => {
  const messageHTML = messageUI(txt, color);
  messagesContainer.insertAdjacentHTML("beforeend", messageHTML);

  setTimeout(function () {
    const messageBoxes = document.querySelectorAll(".messageBox");
    const lastMessageBox = messageBoxes[messageBoxes.length - 1];
    if (lastMessageBox) {
      lastMessageBox.remove();
    }
  }, 3000);
};

// 1. Add event listener to tasks container
// 2. Determine which task originated the event
// 3. If user select delete, the task deleted
// 4. If user select edit, the task edited
taskContainer.addEventListener("click", (event) => {
  let card = event.target.closest(".card");

  if (event.target.id === "deleteBtn") {
    modalHandler(true, alertMessage);
  }

  deleteAlertBtn.addEventListener("click", () => {
    modalHandler(false, alertMessage);
    card.remove();
  });
  cancelAlertBtn.addEventListener("click", () => {
    modalHandler(false, alertMessage);
  });
});
