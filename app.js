let users = JSON.parse(localStorage.getItem("users")) || [];

function registerUser(){

    const fullname =
        document.getElementById("fullname").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const user = {
        fullname,
        email,
        password,
        balance:23000000,
        savings:15000000,
        transactions:[
            {
                type:"Account Created",
                amount:23000000,
                date:new Date().toLocaleString()
            }
        ]
    };

    users.push(user);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Registration Successful");

    window.location.href="login.html";
}

function loginUser(){

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;

    const found =
        users.find(
            user =>
            user.email===email &&
            user.password===password
        );

    if(found){

        localStorage.setItem(
            "currentUser",
            JSON.stringify(found)
        );

        window.location.href="dashboard.html";

    }else{
        alert("Invalid Login");
    }
}

function loadDashboard(){

    let currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    if(!currentUser){
        location.href="login.html";
        return;
    }

    document.getElementById("username").innerText =
        currentUser.fullname;

    document.getElementById("balance").innerText =
        "₦" +
        currentUser.balance.toLocaleString();

    document.getElementById("savings").innerText =
        "₦" +
        currentUser.savings.toLocaleString();

    let history =
        document.getElementById("history");

    history.innerHTML="";

    currentUser.transactions.forEach(t=>{

        history.innerHTML +=
        `<li>${t.type} - ₦${t.amount.toLocaleString()} (${t.date})</li>`;

    });
}

function transferMoney(){

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

    if(amount > currentUser.balance){
        alert("Insufficient Funds");
        return;
    }

    currentUser.balance -= amount;

    currentUser.transactions.push({
        type:"Transfer To " + receiver,
        amount:amount,
        date:new Date().toLocaleString()
    });

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    let allUsers =
        JSON.parse(localStorage.getItem("users"));

    let index =
        allUsers.findIndex(
            u=>u.email===currentUser.email
        );

    allUsers[index] = currentUser;

    localStorage.setItem(
        "users",
        JSON.stringify(allUsers)
    );

    alert("Transfer Successful");

    location.reload();
}

function logout(){

    localStorage.removeItem(
        "currentUser"
    );

    location.href="login.html";
}

function loadAdmin(){

    let allUsers =
        JSON.parse(localStorage.getItem("users"))
        || [];

    document.getElementById("totalUsers")
        .innerText = allUsers.length;

    let total = 0;

    allUsers.forEach(user=>{
        total += user.balance;
    });

    document.getElementById("totalFunds")
        .innerText =
        "₦" + total.toLocaleString();
}
