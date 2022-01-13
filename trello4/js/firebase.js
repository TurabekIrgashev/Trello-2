import { createElement } from "./createEl.js";
import { userData } from "./userObj.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlbODJfsf-pvCrNQdu0IOTwtbvZo90N60",
  authDomain: "fir-learning-2-c96ab.firebaseapp.com",
  databaseURL:
    "https://fir-learning-2-c96ab-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-learning-2-c96ab",
  storageBucket: "fir-learning-2-c96ab.appspot.com",
  messagingSenderId: "696256624301",
  appId: "1:696256624301:web:37ef196390ec712b343824",
  measurementId: "G-Q2RGQY8EDL",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase();

//#region CONSTS
const welcome = document.querySelector("#welcome");
const menuImg = document.querySelector("#menuImg");
const groups = document.querySelector("#groups");
const signContainer = document.querySelector("#signContainer");
const signupContainer = document.querySelector("#signupContainer");
const signInContainer = document.querySelector("#signInContainer");
const window = document.querySelector("#window");
const signupBtn = document.querySelector("#signupBtn");
const signInBtn = document.querySelector("#signInBtn");
const logOut = document.querySelector("#logOut");
const usernameMenu = document.querySelector("#usernameMenu");
const menu = document.querySelector("#menu");
const actionsHeaderTitle = document.querySelector("#actionsHeaderTitle");
const membersUl = document.querySelector("#membersUl");
const chatWriteSec = document.querySelector("#chatWriteSec");
const addForm = document.querySelector("#addForm");
const taskboardPage = document.querySelector("#taskboardPage");
const taskboardBtn = document.querySelector("#taskboardBtn");
const chatPage = document.querySelector("#chatPage");

//#endregion CONSTS
// functions
//#region join team

//#endregion
//#region logOut
logOut.onclick = () => {
  console.log("logout");
  dnone(window);
  dnone(menu);
  dnoner(signContainer);
  dnoner(signInBtn);
  dnoner(signupBtn);
  const userDel = auth.currentUser;
  // deleteUser(userDel)
  //   .then(() => {
  //     console.log("user deleted");
  //   })
  //   .catch((error) => {
  //     console.log(error.code);
  //   });
};
//#endregion logOut
//#region issignIn
const isSignIn = (callback = () => {}) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const starCountRef = ref(db, `users/${user.uid}`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        //updateStarCount(postElement, data);

        userData.imgUrl = data.imgUrl;
        userData.email = data.email;
        userData.username = data.username;
        userData.uid = user.uid;
        menuImg.src = data.imgUrl;
        usernameMenu.innerHTML = data.username;
      });
      callback(true);
    } else {
      console.warn("no sign in");
      callback(false);
    }
  });
};

isSignIn(() => {
  console.log("sign in bolgan");

  dnone(signContainer);
  dnone(welcome);
  dnoner(menu);
  dnone(signupBtn);
  dnone(signInBtn);
  dnoner(window);
  getGroups();
});
//#endregion issignIn
//#region  rigistr
const registr = () => {
  const signupForm = document.querySelector("#signupForm");
  dnoner(signupContainer);
  dnoner(signContainer);
  dnone(welcome);
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#signupEmail").value;
    const pass = document.querySelector("#signupPass").value;
    const username = document.querySelector("#signupUsername").value;
    const img = document.querySelector("#signupImg").value;
    userData.username = username;
    userData.imgUrl = img;
    userData.email = email;

    usernameMenu.innerHTML = username;
    menuImg.src = img;
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        dnoner(welcome);
        userData.uid = userCredential.user.uid;
        const title1 = document.querySelector("#welcomeTitle");
        title1.innerHTML = "Successfully signed! You can SignIn";
        set(ref(db, `users/${userCredential.user.uid}`), {
          username: username,
          email: email,
          imgUrl: img,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("signupda up hato");
      });
  });
};
//#endregion registr

//#region  enter
const enter = () => {
  dnoner(signInContainer);
  dnoner(signContainer);
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#signInEmail").value;
    const pass = document.querySelector("#signInPass").value;
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed in
        console.log("signIn");
        const user = userCredential.user;
        if (user) {
          dnone(signContainer);
          dnone(welcome);
          dnoner(menu);

          dnone(signInBtn);
          dnone(signupBtn);
          dnoner(window);
        }

        getGroups();
      })
      .catch((error) => {
        alert("Password or email failed");
      });
  });
};
//#endregion enter

//#region  setGroupName
const setGroupName = (name, username) => {
  push(ref(db, "groups/"), {
    title: name,
    admin: userData.username,
  });
  getGroups();
};
//#endregion setGroupName

//#region  getgroups
const getGroups = () => {
  const starCountRef = ref(db, "groups/");
  const res = onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    let data1 = Object.entries(data);
    renderGroup(data1);
  });
};
//#endregion getgroups
const groupLists = document.querySelector("#groupLists");
//#region  rendergroup
const renderGroup = (arr) => {
  groupLists.innerHTML = "";
  arr.map((group) => {
    const keyGroup = group[0];
    const li = createElement(
      "li",
      "d-flex align-items-center shadow p-2 justify-content-between",
      "",
      groupLists
    );
    const left = createElement(
      "div",
      "d-flex align-items-center gap-2",
      "",
      li
    );
    const icon = createElement(
      "span",
      "",
      ` <i class="fas fa-user-friends"></i>`,
      left
    );
    const button = createElement("button", "btn grBtn", group[1].title, left);
    button.value = group[1].title;

    button.onclick = () => {
      dnone(addForm);
      userData.isJoin = false;
      actionsHeaderTitle.innerHTML = button.value;

      userData.groupId = keyGroup;
      const taskListUl = document.querySelector("#taskList");
      taskListUl.innerHTML = "";
      const div = createElement(
        "div",
        "d-flex justify-content-center align-items-center w-100 h-100",
        "",
        taskListUl
      );
      const title = createElement(
        "h1",
        "",
        `Welcome to  ${button.value}! You can enter Chat or Taskboard`,
        div
      );

      getGroupMembers(keyGroup);
    };

    const right = createElement("div", "", "", li);

    const icons = createElement(
      "div",
      "d-flex justify-content-end ms-1 align-items-center",

      "",
      right
    );
    const join = createElement(
      "button",
      "btn",
      `<i class="fas fa-arrow-circle-right"></i>`,
      icons
    );
    const exit = createElement(
      "button",
      "btn d-none",
      `<i class="fas fa-arrow-circle-left"></i>`,
      icons
    );
    join.onclick = () => {
      dnoner(addForm);
      getUser((user) => {
        addNewMember(keyGroup, user.uid);
      });
    };
    if (group[1].admin === userData.username) {
      const trash = createElement(
        "button",
        "btn",
        ` <i class="fa fa-trash-alt"></i>`,
        icons
      );
      trash.onclick = () => {
        console.log("trash ishga tushdi");
        remove(ref(db, `groups/${keyGroup}`));
      };
    }
  });
};
//#endregion rendergroups
//#region getuser
const getUser = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      log.warn("User sign in qilmagan");
    }
  });
};
//#endregion getuser
const headerGroup = document.querySelector("#headerGroup");
//#region  member

//#region  add new member
const addNewMember = (keyGroup, userUid) => {
  const starCountRef = ref(db, "groups/");
  set(ref(db, `groups/${keyGroup}/members/${userUid}`), {
    username: userData.username,
    imgUrl: userData.imgUrl,
  });
};
//#endregion add new memeber

//#region get group members
const getGroupMembers = (keyGroup) => {
  const starCountRef = ref(db, `groups/${keyGroup}`);
  const res = onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    renderMembers(data.members);
  });
};

//#region render members
const renderMembers = (members) => {
  const azolar = Object.entries(members) || [];
  membersUl.innerHTML = "";

  azolar.map((mem) => {
    const member = mem[1];
    const li = createElement("li", "d-flex align-items-center", "", membersUl);
    const img = createElement("img", "", "", li);
    img.src = member.imgUrl;
    const p = createElement("p", "m-0 p-0", member.username, li);
    if (userData.username === member.username) {
      userData.isJoin = true;
    }
  });
};
//#region check members

//#endregion check members
//#endregion render members
//#endregion get group members
//#region exports

//#region taskboard
taskboardBtn.onclick = () => {
  console.log("taskboard");
  dnone(chatPage);
  dnoner(taskboardPage);

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

      const title = createElement("p", "m-0 ", item.title, headList);

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
  getTaskLists(renderLists);
  // document.querySelector("body").onload = () => {
  //   getTaskLists(renderLists);
  // };

  const add = document.querySelector("#addList");

  add.onclick = () => {
    const listsInputValue = document.querySelector("#newList").value;
    console.log("add bolsildi");
    const obj = {
      title: listsInputValue,
    };
    push(ref(db, "list/taskslist/"), obj);
  };
};

export { registr, enter, auth, setGroupName, onAuthStateChanged };
//#endregion exposrts
