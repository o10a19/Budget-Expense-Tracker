let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let currencyRates = {};
const expenseTable = document.getElementById("expense-table");
const conversionResult = document.getElementById("conversion-result");
const API_KEY = "8fd9ad230d5c45c3b0cb38ef742902a7";
const API_URL =` https://open.er-api.com/v6/latest/USD`;
async function fetchCurrencyRates() {
    try {
        const response = await fetch(`${API_URL}?apikey=${API_KEY}`);
        const data = await response.json();
        currencyRates = data.rates; 
    } catch (error) {
        console.error("Error fetching currency rates:", error);
    }
}
fetchCurrencyRates();
function addExpense() {
    const name = document.getElementById("expense-name").value.trim();
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Please enter valid expense details.");
        return;
    }

    const expense = { id: Date.now(), name, amount, category };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";

    renderExpenses();
    updateChart();
}
function renderExpenses() {
    expenseTable.innerHTML = "";
    expenses.forEach(expense => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.name}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>
                <button onclick="editExpense(${expense.id})">Edit</button>
                <button onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        `;
        expenseTable.appendChild(row);
    });
}
renderExpenses();
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    updateChart();
}
function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) return;

    document.getElementById("expense-name").value = expense.name;
    document.getElementById("expense-amount").value = expense.amount;
    document.getElementById("expense-category").value = expense.category;

    deleteExpense(id); 
}


function convertCurrency() {
    const selectedCurrency = "INR";  
    if (!currencyRates[selectedCurrency]) {
        conversionResult.textContent = "Error: Currency not available.";
        return;
    }

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const convertedAmount = (totalAmount * currencyRates[selectedCurrency]).toFixed(2);

    conversionResult.textContent = `Total: ₹${convertedAmount}`;
}
let chart;
function updateChart() {
    const categories = ["Food", "Transport", "Entertainment", "Bills", "Other"];
    const categoryTotals = categories.map(cat =>
        expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
    );

    if (chart) chart.destroy(); 
    const ctx = document.getElementById("chart").getContext("2d");
    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                data: categoryTotals,
                backgroundColor: ["#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"]
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#fff" 
                    }
                }
            }
        }
    });
}
updateChart();
