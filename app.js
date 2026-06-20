// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);

/* ===========================
   REGISTER
=========================== */

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

await setDoc(
  doc(db, "Users", email),
  {
    fullname: fullname,
    email: email,
    balance: 23000000,
    savings: 15000000,
    transactions: [
      {
        type: "Account Created",
        amount: 23000000,
        date: new Date().toLocaleString()
      }
    ]
  }
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

    window.location.href =
      "login.html";

  } catch (error) {

    alert(error.message);

  }

};

/* =========================== LOGIN =========================== */

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

    // Firestore lookup
    const userRef =
      doc(db, "Users", email);

    const userSnap =
      await getDoc(userRef);

    if (!userSnap.exists()) {

      alert("User data not found in Firestore");
      return;

    }

    const found =
      userSnap.data();

    localStorage.setItem(
      "currentUser",
      JSON.stringify(found)
    );

    alert("Login Successful");

    window.location.href =
      "dashboard.html";

  } catch (error) {

    alert(
      "Code: " +
      error.code +
      "\nMessage: " +
      error.message
    );

  }

};


/* ===========================
   DASHBOARD
=========================== */

window.loadDashboard = function () {

  let currentUser =
    JSON.parse(
      localStorage.getItem("currentUser")
    );

  if (!currentUser) {

    location.href = "login.html";
    return;

  }

  const username =
    document.getElementById("username");

  const balance =
    document.getElementById("balance");

  const savings =
    document.getElementById("savings");

  if (username)
    username.innerText =
      currentUser.fullname;

  if (balance)
    balance.innerText =
      "$" +
      currentUser.balance.toLocaleString();

  if (savings)
    savings.innerText =
      "$" +
      currentUser.savings.toLocaleString();

  const history =
    document.getElementById("history");

  if (history) {

    history.innerHTML = "";

    currentUser.transactions.forEach(t => {

      history.innerHTML += `
        <li>
          ${t.type}
          - ₦${t.amount.toLocaleString()}
          (${t.date})
        </li>
      `;

    });

  }

};

/* ===========================
   TRANSFER
=========================== */

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

  if (!currentUser) {

    alert("Login Required");
    return;

  }

  if (amount <= 0) {

    alert("Enter Valid Amount");
    return;

  }

  if (amount > currentUser.balance) {

    alert("Insufficient Funds");
    return;

  }

  currentUser.balance -= amount;

  currentUser.transactions.push({

    type: "Transfer",
    amount: amount,
    date: new Date().toLocaleString()

  });

  localStorage.setItem(
    "currentUser",
    JSON.stringify(currentUser)
  );

  let allUsers =
    JSON.parse(
      localStorage.getItem("users")
    ) || [];

  let index =
    allUsers.findIndex(
      u => u.email === currentUser.email
    );

  if (index !== -1) {

    allUsers[index] =
      currentUser;

    localStorage.setItem(
      "users",
      JSON.stringify(allUsers)
    );

  }

  showReceipt(receiver, amount);

  alert("Transfer Successful");

  location.reload();

};

/* ===========================
   LOGOUT
=========================== */

window.logout = async function () {

  await signOut(auth);

  localStorage.removeItem(
    "currentUser"
  );

  location.href =
    "login.html";

};

/* ===========================
   ADMIN
=========================== */

window.loadAdmin = function () {

  let allUsers =
    JSON.parse(
      localStorage.getItem("users")
    ) || [];

  document.getElementById(
    "totalUsers"
  ).innerText =
    allUsers.length;

  let total = 0;

  allUsers.forEach(user => {

    total += user.balance;

  });

  document.getElementById(
    "totalFunds"
  ).innerText =
    "$" +
    total.toLocaleString();

};

/* ===========================
   AI ASSISTANT
=========================== */

window.askAI = function () {

  const input =
    document.getElementById("userQuestion")
      .value
      .toLowerCase();

  const output =
    document.getElementById("aiMessage");

  let currentUser =
    JSON.parse(
      localStorage.getItem("currentUser")
    );

  if (!currentUser) return;

  if (input.includes("balance")) {

    output.innerText =
      "Your available balance is $" +
      currentUser.balance.toLocaleString();

  } else if (
    input.includes("savings")
  ) {

    output.innerText =
      "Your savings balance is $" +
      currentUser.savings.toLocaleString();

  } else if (
    input.includes("transfer")
  ) {

    output.innerText =
      "Use the Transfer Money section to send funds.";

  } else {

    output.innerText =
      "I can help with balance, savings and transfers.";

  }

};

/* ===========================
   DARK MODE
=========================== */

window.toggleDarkMode =
  function () {

    document.body.classList.toggle(
      "dark-mode"
    );

    localStorage.setItem(
      "theme",
      document.body.classList.contains(
        "dark-mode"
      )
        ? "dark"
        : "light"
    );

  };

window.addEventListener(
  "load",
  () => {

    if (
      localStorage.getItem("theme")
      === "dark"
    ) {

      document.body.classList.add(
        "dark-mode"
      );

    }

  }
);

/* ===========================
   RECEIPT
=========================== */

window.showReceipt =
  function (receiver, amount) {

    const modal =
      document.getElementById(
        "receiptModal"
      );

    if (!modal) return;

    const ref =
      "CB" + Date.now();

    document.getElementById(
      "receiptReceiver"
    ).innerText =
      "Receiver: " + receiver;

    document.getElementById(
      "receiptAmount"
    ).innerText =
      "Amount: $" +
      Number(amount).toLocaleString();

    document.getElementById(
      "receiptRef"
    ).innerText =
      "Reference: " + ref;

    modal.style.display =
      "flex";

  };

window.closeReceipt =
  function () {

    document.getElementById(
      "receiptModal"
    ).style.display =
      "none";

  };
function applyLoan() {
    alert("Loan application submitted.");
}

window.applyLoan = applyLoan;

/* ===========================
   TRANSFER HISTORY
=========================== */

window.loadTransferHistory =
  function () {

    let currentUser =
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      );

    const table =
      document.getElementById(
        "historyTable"
      );

    if (
      !table ||
      !currentUser
    )
      return;

    table.innerHTML = "";

    currentUser.transactions.forEach(
      t => {

        table.innerHTML += `
        <tr>
          <td>${t.date}</td>
          <td>${t.type}</td>
          <td>₦${t.amount.toLocaleString()}</td>
        </tr>
      `;

      }
    );

  };
