// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAp7cXdiuLsHEL0XdBZZiYW5j9yvnGmlb8",
  authDomain: "capital-bank-42524.firebaseapp.com",
  projectId: "capital-bank-42524",
  storageBucket: "capital-bank-42524.firebasestorage.app",
  messagingSenderId: "622953995653",
  appId: "1:622953995653:web:64c7503cc459019662b8ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Register User
window.registerUser = async function () {

  const fullname =
    document.getElementById("fullname").value;

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  try {

    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = {
      fullname,
      email,
      balance: 23000000,
      savings: 15000000,
      transactions: [
        {
          type: "Account Created",
          amount: 23000000,
          date: new Date().toLocaleString()
        }
      ]
    };

    let users =
      JSON.parse(localStorage.getItem("users"))
      || [];

    users.push(user);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    alert("Registration Successful");

    window.location.href = "login.html";

  } catch (error) {

    alert(error.message);

  }
};

// Login User
window.loginUser = async function () {

  const email =
    document.getElementById("loginEmail").value;

  const password =
    document.getElementById("loginPassword").value;

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    let users =
      JSON.parse(localStorage.getItem("users"))
      || [];

    const found =
      users.find(
        user => user.email === email
      );

    localStorage.setItem(
      "currentUser",
      JSON.stringify(found)
    );

    window.location.href =
      "dashboard.html";

  } catch (error) {

    alert("Invalid Login");

  }
};

// Dashboard
window.loadDashboard = function () {

  let currentUser =
    JSON.parse(
      localStorage.getItem("currentUser")
    );

  if (!currentUser) {

    location.href = "login.html";
    return;

  }

  document.getElementById("username")
    .innerText =
    currentUser.fullname;

  document.getElementById("balance")
    .innerText =
    "₦" +
    currentUser.balance.toLocaleString();

  document.getElementById("savings")
    .innerText =
    "₦" +
    currentUser.savings.toLocaleString();

  let history =
    document.getElementById("history");

  if (history) {

    history.innerHTML = "";

    currentUser.transactions.forEach(t => {

      history.innerHTML +=
        `<li>${t.type} - ₦${t.amount.toLocaleString()} (${t.date})</li>`;

    });

  }
};

// Transfer
window.transferMoney = function () {

  let receiver =
    document.getElementById("receiver").value;

  let amount =
    Number(
      document.getElementById("amount").value
    );

  let currentUser =
    JSON.parse(
      localStorage.getItem("currentUser")
    );

  if (amount > currentUser.balance) {

    alert("Insufficient Funds");
    return;

  }

  currentUser.balance -= amount;

  currentUser.transactions.push({
    type: "Transfer To " + receiver,
    amount: amount,
    date: new Date().toLocaleString()
  });
  
showReceipt(receiver, amount);
  
  localStorage.setItem(
    "currentUser",
    JSON.stringify(currentUser)
  );

  let allUsers =
    JSON.parse(
      localStorage.getItem("users")
    );

  let index =
    allUsers.findIndex(
      u => u.email === currentUser.email
    );

  allUsers[index] = currentUser;

  localStorage.setItem(
    "users",
    JSON.stringify(allUsers)
  );

  alert("Transfer Successful");

  location.reload();

};

// Logout
window.logout = async function () {

  await signOut(auth);

  localStorage.removeItem(
    "currentUser"
  );

  location.href = "login.html";

};

// Admin
window.loadAdmin = function () {

  let allUsers =
    JSON.parse(
      localStorage.getItem("users")
    ) || [];

  document.getElementById("totalUsers")
    .innerText =
    allUsers.length;

  let total = 0;

  allUsers.forEach(user => {

    total += user.balance;

  });

  document.getElementById("totalFunds")
    .innerText =
    "₦" + total.toLocaleString();

};

// AI Assistant
window.askAI = function () {

  const input =
    document.getElementById("aiInput")
    .value
    .toLowerCase();

  const output =
    document.getElementById("aiMessage");

  let currentUser =
    JSON.parse(
      localStorage.getItem("currentUser")
    );

  if (input.includes("balance")) {

    output.innerText =
      "Your available balance is ₦" +
      currentUser.balance.toLocaleString();

  }

  else if (input.includes("savings")) {

    output.innerText =
      "Your savings balance is ₦" +
      currentUser.savings.toLocaleString();

  }

  else if (input.includes("transfer")) {

    output.innerText =
      "Use the Transfer Money section to send funds.";

  }

  else {

    output.innerText =
      "I can help with balance, savings and transfers.";

  }

};
let transfers = [];

{
  

function transferMoney(){

let receiver =
document.getElementById("receiver").value;

let amount =
document.getElementById("amount").value;

let ref =
"CB" + Date.now();

document.getElementById(
"receiptReceiver"
).innerHTML =
"Receiver: " + receiver;

document.getElementById(
"receiptAmount"
).innerHTML =
"Amount: ₦" + amount;

document.getElementById(
"receiptRef"
).innerHTML =
"Reference: " + ref;

document.getElementById(
"receiptModal"
).style.display="flex";

}
    table.innerHTML = "";

    transfers.forEach(t => {

        table.innerHTML += `
        <tr>
            <td>${t.date}</td>
            <td>${t.receiver}</td>
            <td>₦${t.amount}</td>
        </tr>
        `;
    });

    alert("Transfer Successful");
}

function logout() {
    window.location.href = "login.html";
}
function toggleDarkMode(){

document.body.classList.toggle("dark-mode");

if(document.body.classList.contains("dark-mode")){
localStorage.setItem("theme","dark");
}else{
localStorage.setItem("theme","light");
}

}

window.onload=function(){

if(localStorage.getItem("theme")==="dark"){
document.body.classList.add("dark-mode");
}

};
/* ===========================
   DARK MODE
=========================== */

window.toggleDarkMode = function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");

    } else {

        localStorage.setItem("theme", "light");

    }
};

window.addEventListener("load", () => {

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark-mode");

    }

});


/* ===========================
   TRANSFER RECEIPT
=========================== */

window.showReceipt = function(receiver, amount) {

    const receiptModal =
        document.getElementById("receiptModal");

    if (!receiptModal) return;

    const ref =
        "CB" + Date.now();

    document.getElementById(
        "receiptReceiver"
    ).innerText =
        "Receiver: " + receiver;

    document.getElementById(
        "receiptAmount"
    ).innerText =
        "Amount: ₦" +
        Number(amount).toLocaleString();

    document.getElementById(
        "receiptRef"
    ).innerText =
        "Reference: " + ref;

    receiptModal.style.display = "flex";
};

window.closeReceipt = function() {

    document.getElementById(
        "receiptModal"
    ).style.display = "none";

};


/* ===========================
   TRANSFER HISTORY TABLE
=========================== */

window.loadTransferHistory = function() {

    let currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    const table =
        document.getElementById(
            "historyTable"
        );

    if (!table || !currentUser) return;

    table.innerHTML = "";

    currentUser.transactions.forEach(t => {

        table.innerHTML += `
        <tr>
            <td>${t.date}</td>
            <td>${t.type}</td>
            <td>₦${t.amount.toLocaleString()}</td>
        </tr>
        `;

    });

};
