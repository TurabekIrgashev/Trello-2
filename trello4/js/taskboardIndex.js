// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";

import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfYphlpCZF97V35rKEgWVZLYefnKBpdS8",
  authDomain: "todolist-7edd5.firebaseapp.com",
  databaseURL:
    "https://todolist-7edd5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todolist-7edd5",
  storageBucket: "todolist-7edd5.appspot.com",
  messagingSenderId: "325366154032",
  appId: "1:325366154032:web:284a61320f8a3dd57c7ef5",
  measurementId: "G-B07THWSDDN",
};

// const board = document.querySelector("#board");
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// databasega ulanish
const db = getDatabase();
// const auth = getAuth();

// databasega murojat
const dbRef = ref(db);

const listsInput = document.querySelector("#newList");

const lists = document.querySelector("#lists");

const createElement = (tagName, className, innerHTML, father) => {
  const element = document.createElement(tagName);
  element.innerHTML = innerHTML;
  element.className = className;

  father && father.append(element);

  return element;
};

const getTaskLists = (callback) => {
  const starCountRef = ref(db, "list/taskslist");
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();

    callback(data);
  });
};

const renderLists = (data) => {
  const arrayData = Object.entries(data || {});

  lists.innerHTML = "";

  const container = createElement("div", "container-fluid", "", lists);
  const row = createElement("div", "row", "", container);

  arrayData.map((message) => {
    const item = message[1];
    const key = message[0];

    const tasksArray = Object.entries(item.tasks || {});

    const list = document.createElement("div");
    list.className = "col-sm-6 col-md-3 m-1 list shadow p-3";

    const headList = createElement(
      "div",
      "headList d-flex align-items-center justify-content-between",
      "",
      list
    );

    const title = createElement(
      "p",
      "m-0 overflow-hidden",
      item.title,
      headList
    );

    const titleInput = createElement(
      "input",
      "d-none form-control",
      "",
      headList
    );
    const editTitleBtn = createElement(
      "button",
      "btn d-none ms-2",
      `<i class = "fas fa-check"></i>`,
      headList
    );

    const headBtn = createElement(
      "button",
      "btn m-1",
      `<i class = "fas fa-ellipsis-v"></i>`,
      headList
    );

    headBtn.onmouseover = () => {
      headBtn.style.background = "#CED1DA";
    };
    headBtn.onmouseleave = () => {
      headBtn.style.background = "#EBECF0";
    };

    const ellipse = createElement(
      "div",
      "d-none shadow p-3 ellipse",
      "",
      headList
    );

    const deleteList = createElement(
      "button",
      "btn w-100",
      `<i class="me-2 fas fa-trash-alt"></i>`,
      ellipse
    );
    const editList = createElement(
      "button",
      "btn w-100",
      `<i class="me-2 fas fa-edit"></i>`,
      ellipse
    );

    deleteList.onmouseover = () => {
      deleteList.style.background = "#CED1DA";
    };
    deleteList.onmouseleave = () => {
      deleteList.style.background = "white";
    };

    editList.onmouseover = () => {
      editList.style.background = "#CED1DA";
    };
    editList.onmouseleave = () => {
      editList.style.background = "white";
    };

    const deleteSpan = createElement("span", "", "Delete List", deleteList);
    const editSpan = createElement("span", "", "Edit List", editList);

    headBtn.onclick = () => {
      if (ellipse.classList.contains("d-none")) {
        ellipse.classList.remove("d-none");
        ellipse.classList.add("d-flex");
        ellipse.classList.add("flex-column");
        ellipse.classList.add("align-items-start");
        deleteList.onclick = () => {
          remove(ref(db, `list/taskslist/${key}`));
        };
        titleInput.value = item.title;
        editList.onclick = () => {
          title.classList.add("d-none");
          titleInput.classList.remove("d-none");
          editTitleBtn.classList.remove("d-none");
          editTitleBtn.onclick = () => {
            if (titleInput.value === "") return;
            update(ref(db, `list/taskslist/${key}`), {
              title: titleInput.value,
            });
            title.classList.remove("d-none");
            titleInput.classList.add("d-none");
            editTitleBtn.classList.add("d-none");
            ellipse.classList.add("d-none");
          };
        };
      } else {
        ellipse.classList.add("d-none");
      }
    };
    headBtn.onblur = () => {
      setTimeout(() => {
        ellipse.classList.add("d-none");
      }, 350);
    };

    // Add task form
    const addForm = createElement(
      "div",
      "d-flex rounded align-items-center",
      "",
      list
    );
    const addFormBtn = createElement(
      "button",
      "btn",
      `<i class = "fas fa-plus"></i>`,
      addForm
    );
    const addFormParagraph = createElement(
      "p",
      "paragraph p-0 m-0",
      " Add tasks",
      addForm
    );

    addForm.onmouseover = () => {
      addForm.style.background = "#CED1DA";
    };
    addForm.onmouseleave = () => {
      addForm.style.background = "#EBECF0";
    };

    const addFormInput = createElement(
      "input",
      "d-none form-control",
      "",
      addForm
    );
    const addFormChecked = createElement(
      "button",
      "btn d-none ms-2",
      `<i class = "fas fa-check"></i>`,
      addForm
    );
    addFormInput.placeholder = "Add New Task";

    addForm.onclick = (item) => {
      addFormInput.classList.remove("d-none");
      addFormParagraph.classList.add("d-none");
      addFormChecked.classList.remove("d-none");
      addFormChecked.onclick = () => {
        if (addFormInput.value === "") return;
        // addTask(task, list);
        // push(ref(db,), addFormInput.value);
        push(ref(db, `list/taskslist/${key}/tasks`), {
          task: addFormInput.value,
        });
      };
    };

    // Todo body

    tasksArray.map((taskItem) => {
      const keyTask = taskItem[0];
      const taskObj = taskItem[1];

      const todoBody = createElement("div", "todo-body", "", list);

      const tasksTodo = createElement("ul", "tasksTodo", "", todoBody);

      const task = createElement(
        "li",
        "p-1 m-1 d-flex justify-content-between",
        "",
        tasksTodo
      );

      const span = createElement("span", "ms-2", taskObj.task, task);

      const btns = createElement("div", "", "", task);

      const deleteBtn = createElement(
        "button",
        "btn p-0 px-1 m-0",
        `<i class="fas fa-trash-alt"></i>`,
        btns
      );
      const editBtn = createElement(
        "button",
        "btn p-0 px-1 m-0",
        `<i class="fas fa-edit"></i>`,
        btns
      );

      const editTaskInput = createElement(
        "input",
        "d-none form-control",
        "",
        task
      );
      const editTaskChecked = createElement(
        "button",
        "btn d-none ms-2",
        `<i class = "fas fa-check"></i>`,
        task
      );

      deleteBtn.style.color = "white";
      editBtn.style.color = "white";

      task.onmouseover = () => {
        deleteBtn.style.color = "#CED1DA";
        editBtn.style.color = "#CED1DA";
        deleteBtn.onclick = () => {
          // tasksTodo.remove();
          remove(ref(db, `list/taskslist/${key}/tasks/${keyTask}`));
        };
        editBtn.onclick = () => {
          editTaskInput.classList.remove("d-none");
          editTaskChecked.classList.remove("d-none");
          deleteBtn.classList.add("d-none");
          editBtn.classList.add("d-none");
          span.classList.add("d-none");
          editTaskInput.value = taskObj.task;
          editTaskChecked.onclick = () => {
            update(ref(db, `list/taskslist/${key}/tasks/${keyTask}`), {
              task: editTaskInput.value,
            });
            editTaskInput.classList.add("d-none");
            editTaskChecked.classList.add("d-none");
            deleteBtn.classList.remove("d-none");
            editBtn.classList.remove("d-none");
            span.classList.remove("d-none");
          };
        };
      };
      task.onmouseleave = () => {
        deleteBtn.style.color = "white";
        editBtn.style.color = "white";
      };
    });

    row.append(list);
  });
};

document.querySelector("body").onload = () => {
  getTaskLists(renderLists);
};

const add = document.querySelector("#addList");

add.onclick = () => {
  const listsInputValue = document.querySelector("#newList").value;
  console.log("add bolsildi");
  const obj = {
    title: listsInputValue,
  };
  push(ref(db, "list/taskslist/"), obj);
};
