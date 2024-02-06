import Modal from "./modal.js";

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

let activeModalCallback;

function modalHandler(val, modal, onSucess) {
  if (val) {
    fadeIn(modal);
  } else {
    fadeOut(modal);
    return;
  }

  activeModalCallback = onSucess;

  const primaryBtn = modal.querySelector(".primaryBtn");
  const secondaryBtn = modal.querySelector(".secondaryBtn");

  const primaryHandler = () => {
    onSucess();
    modalHandler(false, modal);
  };

  if (!secondaryBtn) return;
  if (!primaryBtn) return;

  secondaryBtn.addEventListener("click", () => {
    modalHandler(false, modal);
  });

  //primaryBtn.removeEventListener("click", primaryHandler);
  primaryBtn.addEventListener("click", primaryHandler, { once: true });
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
const alertMessage = document.querySelector("#alertModal");
const alertModal = new Modal(alertMessage);
const actionState = document.querySelector(".action");

alertModal.init();
const formTaskModal = new Modal(newTaskModal);

const taskCards = [
  {
    title: "title for task 1",
    description: "description for task 1",
    date: "2023-02-08",
    priority: "Low",
  },
  {
    title: "title for task 1",
    description: "description for task 1",
    date: "2024-02-08",
    priority: "Meduim",
  },
  {
    title: "title for task 1",
    description: "description for task 1",
    date: "2022-02-08",
    priority: "High",
  },
];

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  actionState.value = "";
  // Initialize Alert modal with false state
  //modalHandler(false, alertMessage);
  renderTasks();
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
  //modalHandler(false, newTaskModal);
  setTimeout(clearFields(formInputs), 1000);
};

// Give a color name based on level priority
const priorityLevel = (level) => {
  return {
    Low: "green",
    Meduim: "amber",
    High: "red",
  }[level];

  if (level === "Low") return "green";
  if (level === "Meduim") return "amber";
  if (level === "High") return "red";
};

// 1. Get the value of each field input in the form and store them in an object
// 2. Show special Error message if inputs are not filled
// 3. return Object which has 4 property based on user filled on task form

const getFormTask = () => {
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

  //console.log(taskObj);
  //closeTaskForm();
  return taskObj;
};

// Closing Task Form by hiding it and showing Dashboard Container
const closeTaskForm = () => {
  formTaskModal.hide();
  //fadeOut(newTaskModal);
  setTimeout(clearFields(formInputs), 1000);
  dashboardContainer.style.display = "none";
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
      <div class="flex items-center cursor-pointer">
          <input for="title" type="checkbox" value="${title}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
          <label id="title" class="info pl-3 text-xl font-medium text-gray-800 dark:text-night-silver">
          ${title}
          </label>
      </div>
      <p id="priority" class="text-sm font-medium text-gray-500">
        Priority: <span class="info text-${priorityClr}-600" id='priority'>${priority}</span>
      </p>
    </div>
    <div class="mt-2 flex items-end justify-between">
      <div>
      <p  class="text-xs text-gray-500 text-semibold">Schelued: 
        <span id="date" class="info">
          ${date}</span
        ></p>
        <p id="description" class="info mt-1 max-w-2xl text-md text-gray-600">
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
  el.addEventListener("click", () => {
    actionState.value = "create";
    aside.classList.add("closed");
    formTaskModal.show();
    //modalHandler(true, newTaskModal);
  });
});

// Create a new Task and add it to the DOM
submitFormBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (actionState.value === "create") {
    const task = getFormTask();
    if (task === null || task === "") return;
    taskCards.push(task);
  }

  formTaskModal.hide();
  renderTasks();
});

closeBtns.forEach((btn) => {
  btn.addEventListener("click", closeModal);
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
  return `<div class="relative z-50 messageBox transition-opacity bg-${color}-100 border-t-4 border-${color}-600 rounded-b text-${color}-900 ml-3 mb-3 px-4 py-3 shadow-md" role="alert">
  <div class="flex">
    <div class="py-1"><svg class="fill-current h-6 w-6 text-${color}-600 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
    <div>
      <p class="font-bold">${txt}</p>
    </div>
  </div>
</div>`;
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
// const taskBtnsHandler = (event) => {
//   let card = event.target.closest(".card");

//   if (!card) return;

//   // const cardDeleteBtn = card.querySelector(".deleteBtn");
//   // const cardEditBtn = card.querySelector(".editBtn");

//   // if (cardDeleteBtn) {
//   //   modalHandler(true, alertMessage);
//   // }

//   // deleteAlertBtn.addEventListener("click", () => {
//   //   deleteAlertHandler(card);
//   // });
//   // cancelAlertBtn.addEventListener("click", () => {
//   //   modalHandler(false, alertMessage);
//   // });
// };

// const deleteAlertHandler = (card) => {
//   modalHandler(false, alertMessage);
//   const cardID = card.dataset.id;

//   taskCards.splice(cardID, 1);
//   //delete taskCards[cardID];
//   renderTasks();
// };

// taskContainer.addEventListener("click", (event) => {
//   taskBtnsHandler(event);
// });

// 1. Get values from card of task and store them in object
// 2. Based on the data it gets from the object, it enters them into the form for editing
// 3. Remove old card with old values
const getValuesOfTask = (taskCard) => {
  const cardObj = {};

  const card = taskCard.querySelectorAll(".info");
  card.forEach((el) => {
    cardObj[el.id] = el.textContent.trim();
  });

  Object.entries(cardObj).forEach(([key, value]) => {
    const input = document.querySelector(`#${key}`);
    if (input) {
      input.value = value;
    }
  });
  //taskCard.remove();
  return cardObj;
};

const renderTasks = () => {
  // Clear tasks before rendering new ones
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.remove());

  console.log("taskCards after reRender : ", taskCards);

  taskCards.forEach((task, i) => {
    const { title, description, date, priority } = task;
    taskContainer.insertAdjacentHTML(
      "beforeend",
      displayTask(title, description, date, priority, i)
    );
  });

  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      console.log("clicked");
      alertModal.show(() => {
        const cardID = event.target.dataset.id;
        console.log("ID of card we want delete : ", cardID);
        console.log("taskCards before Render: ", taskCards);
        taskCards.splice(cardID, 1);
        renderTasks();
      });

      // modalHandler(true, alertMessage, () => {
      //   const cardID = event.target.dataset.id;
      //   console.log("ID of card we want delete : ", cardID);
      //   console.log("taskCards before Render: ", taskCards);
      //   taskCards.splice(cardID, 1);
      //   renderTasks();
      //   modalHandler(false, alertMessage);
      // });
      //deleteAlertHandler(card);
    });
  });
  document.querySelectorAll(".editBtn").forEach((btn) => {
    formTaskModal.init();
    btn.addEventListener("click", (event) => {
      actionState.value = "edit";
      const cardID = event.target.dataset.id;
      Object.entries(taskCards[cardID]).forEach(([key, value]) => {
        const input = document.querySelector(`#${key}`);
        if (input) {
          input.value = value;
        }
      });

      formTaskModal.show(() => {
        taskCards[cardID] = getFormTask();
        renderTasks();
      });
    });
  });
};
