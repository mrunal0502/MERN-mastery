document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const totalAmountDisplay = document.getElementById("total-amount");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let totalAmount = calculateTotal();

  // Initialize the display when page loads
  renderExpenseList();
  updateTotal();

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);

    if (name !== "" && !isNaN(amount) && amount > 0) {
      console.log("Adding expense:", name, amount);
      const newExpense = {
        id: Date.now(),
        name,
        amount,
      };
      expenses.push(newExpense);

      totalAmountDisplay.textContent = `${totalAmount.toFixed(2)}`;
      saveExpenses();
      updateTotal();
      expenseAmountInput.value = "";
      expenseNameInput.value = "";
      renderExpenseList();
    }
  });

  function calculateTotal() {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }

  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = `${totalAmount.toFixed(2)}`;
  }

  function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function renderExpenseList() {
    expenseList.innerHTML = "";
    expenses.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${item.name}</span>
                            <span>$${item.amount.toFixed(2)}</span>
                            <button data-id="${item.id}">Delete</button>`;
      expenseList.appendChild(li);
    });
  }

  expenseList.addEventListener("click", (e) => {
    console.log("Click detected on:", e.target);
    console.log("Target tagName:", e.target.tagName);

    if (e.target.tagName === "BUTTON") {
      const prodID = parseInt(e.target.getAttribute("data-id"));
      console.log("Button clicked with ID:", prodID);
      console.log("Current expenses:", expenses);

      let index = expenses.findIndex((item) => item.id === prodID);
      console.log("Found index:", index);

      if (index !== -1) {
        expenses.splice(index, 1);
        console.log("Expense removed. New expenses:", expenses);
        saveExpenses();
        updateTotal();
        renderExpenseList();
      }
    }
  });
});
