import { registr, enter } from "./firebase.js";

//consts

const signupBtn = document.querySelector("#signupBtn");
const signInBtn = document.querySelector("#signInBtn");
// consts

//onclicks

signupBtn.onclick = () => {
    registr();
};

signInBtn.onclick = () => {
  dnone(signupContainer);
  enter();
};
