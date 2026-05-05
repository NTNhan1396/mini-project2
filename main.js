let array = [];

let name = document.querySelector(".input_name");
let number = document.querySelector(".input_money");

let list = document.getElementById("list");

let btn_add = document.querySelector(".input_add");
btn_add.disabled = true;

let type = document.querySelector(".input_type");

let balance = document.getElementById("balance");
let income = document.getElementById("income");
let expense = document.getElementById("expense");

let btn_clearAll = document.querySelector(".input_clear");
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

function checkInput() {
  if (name.value === "" || number.value === "") {
    btn_add.disabled = true;
  } else {
    btn_add.disabled = false;
  }
}

name.addEventListener("input", checkInput);
number.addEventListener("input", checkInput);

type.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    appendList();

    name.focus();
    type.value = "income";
  }
});

//add task--------------------------------------------
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

  //reset
  name.value = "";
  number.value = "";
  btn_add.disabled = true;
}

function render() {
  if (array.length === 0) {
    list.innerHTML = "<p>Chưa có giao dịch</p>";
    balance.textContent = "0 VND";
    income.textContent = "0 VND";
    expense.textContent = "0 VND";
    return;
  }
  list.innerHTML = "";

  for (let item of array) {
    let li = document.createElement("li");
    li.classList.add("item");
    li.classList.add(item.type);

    let div = document.createElement("div");
    div.classList.add("item_info");

    let p_name = document.createElement("p");
    p_name.classList.add("item_name");
    p_name.textContent = "Giao dịch: " + item.text;

    let p_amount = document.createElement("p");
    p_amount.classList.add("item_amount");
    p_amount.textContent = "Số tiền: " + item.amount.toLocaleString() + " VND";

    let btn_remove = document.createElement("button");
    btn_remove.classList.add("item_delete");
    btn_remove.textContent = "❌";

    let dateNow = document.createElement("p");
    dateNow.classList.add("item_time");
    dateNow.textContent = "Thời gian: " + item.date;

    div.append(p_name, p_amount, dateNow);
    li.append(div, btn_remove);
    list.append(li);

    btn_remove.addEventListener("click", () => {
      array = array.filter((t) => t.id !== item.id);
      render();
    });
  }

  let incomeTotal = 0;
  let expenseTotal = 0;

  if (item.type === "income") {
    incomeTotal += item.amount;
  } else if (item.type === "expense") {
    expenseTotal += item.amount;
  }

  let total = incomeTotal - expenseTotal;

  balance.textContent = total.toLocaleString() + " VND";
  income.textContent = incomeTotal.toLocaleString() + " VND";
  expense.textContent = expenseTotal.toLocaleString() + " VND";
}

btn_clearAll.addEventListener("click", () => {
  array = [];
  render();
});
