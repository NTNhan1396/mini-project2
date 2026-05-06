let array = [];

// ===== DOM =====
let name = document.querySelector(".input_name");
let number = document.querySelector(".input_money");
let list = document.getElementById("list");

let btn_add = document.querySelector(".input_add");
btn_add.disabled = true;

let type = document.querySelector(".input_type");

let balance = document.getElementById("balance");
let income = document.getElementById("income");
let expense = document.getElementById("expense");

let filter = document.querySelector(".filter_select");
let btn_clearAll = document.querySelector(".input_clear");

// ===== EVENT =====
btn_add.addEventListener("click", () => {
  appendList();
  name.focus();
  type.value = "income";
});

name.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    number.focus();
  }
});

number.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    appendList();
    name.focus();
    type.value = "income";
  }
});

type.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    appendList();
    name.focus();
    type.value = "income";
  }
});

filter.addEventListener("change", () => {
  filter.className = "filter_select " + filter.value;
  render();
});

btn_clearAll.addEventListener("click", () => {
  array = [];
  render();
});

// ===== VALIDATION =====
function checkInput() {
  if (name.value === "" || number.value === "") {
    btn_add.disabled = true;
  } else {
    btn_add.disabled = false;
  }
}

name.addEventListener("input", checkInput);
number.addEventListener("input", checkInput);

// ===== ADD =====
function appendList() {
  if (name.value === "" || number.value === "") {
    alert("Bạn chưa nhập gì!");
    return;
  }

  if (Number(number.value) <= 0) {
    alert("Số tiền phải lớn hơn 0");
    return;
  }

  let amount = Number(number.value);
  let now = new Date();

  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");
  let seconds = String(now.getSeconds()).padStart(2, "0");

  let date = `${hours}:${minutes}:${seconds} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

  let transactions = {
    id: Date.now(),
    text: name.value.trim(),
    amount: amount,
    type: type.value,
    date: date,
  };

  array.push(transactions);

  render();

  // reset
  name.value = "";
  number.value = "";
  btn_add.disabled = true;
}

// ===== RENDER =====
function render() {
  if (array.length === 0) {
    list.innerHTML = "<li>Chưa có giao dịch</li>";
    balance.textContent = "0 VND";
    income.textContent = "0 VND";
    expense.textContent = "0 VND";
    return;
  }

  renderList();
  renderSummary();
}

// ===== RENDER LIST =====
function renderList() {
  list.innerHTML = "";

  let filteredArray = array;

  if (filter.value !== "all") {
    filteredArray = array.filter((item) => item.type === filter.value);
  }

  for (let item of filteredArray) {
    let li = document.createElement("li");
    li.classList.add("item", item.type);

    let div = document.createElement("div");
    div.classList.add("item_info");

    let p_name = document.createElement("p");
    p_name.classList.add("item_name");
    p_name.textContent = "Giao dịch: " + item.text;

    let p_amount = document.createElement("p");
    p_amount.classList.add("item_amount");
    p_amount.textContent = "Số tiền: " + item.amount.toLocaleString() + " VND";

    let dateNow = document.createElement("p");
    dateNow.classList.add("item_time");
    dateNow.textContent = "Thời gian: " + item.date;

    let btn_remove = document.createElement("button");
    btn_remove.classList.add("item_delete");
    btn_remove.textContent = "❌";

    btn_remove.addEventListener("click", () => {
      array = array.filter((t) => t.id !== item.id);
      render();
    });

    div.append(p_name, p_amount, dateNow);
    li.append(div, btn_remove);
    list.append(li);
  }
}

// ===== SUMMARY =====
function renderSummary() {
  let incomeTotal = 0;
  let expenseTotal = 0;

  for (let arr of array) {
    if (arr.type === "income") {
      incomeTotal += arr.amount;
    } else if (arr.type === "expense") {
      expenseTotal += arr.amount;
    }
  }

  let total = incomeTotal - expenseTotal;

  balance.textContent = total.toLocaleString() + " VND";
  income.textContent = incomeTotal.toLocaleString() + " VND";
  expense.textContent = expenseTotal.toLocaleString() + " VND";
}
