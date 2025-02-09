let currencyRates = {};
const API_KEY = "8fd9ad230d5c45c3b0cb38ef742902a7";
const API_URL = `https://open.er-api.com/v6/latest/USD`;
async function fetchCurrencyRates() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        currencyRates = data.rates;
        populateCurrencyOptions();
        showNotification("Currency rates updated successfully!", "success");
    } catch (error) {
        console.error("Error fetching currency rates:", error);
        showNotification("Failed to fetch currency rates.", "error");
    }
}
function populateCurrencyOptions() {
    const currencySelect = document.getElementById("currency");
    currencySelect.innerHTML = '<option value="" disabled selected>Select Currency</option>';

    Object.keys(currencyRates).sort().forEach((currency, index) => {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = `${currency} - ${getCurrencySymbol(currency)}`;
        option.style.animation =` fadeIn 0.3s ease forwards ${index * 0.05}s`;
        currencySelect.appendChild(option);
    });
}
function getCurrencySymbol(currency) {
    const symbols = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        JPY: "¥",
        INR: "₹",
    };
    return symbols[currency] || currency;
}
function convertCurrency() {
    const amountInUSD = parseFloat(document.getElementById("amount").value);
    const selectedCurrency = document.getElementById("currency").value;
    const resultElement = document.getElementById("conversion-result");
    
    if (isNaN(amountInUSD) || amountInUSD <= 0) {
        showNotification("Please enter a valid amount.", "error");
        return;
    }

    if (!selectedCurrency) {
        showNotification("Please select a currency.", "error");
        return;
    }

    if (!currencyRates[selectedCurrency]) {
        showNotification("Selected currency rate is not available.", "error");
        return;
    }

    const convertedAmount = (amountInUSD * currencyRates[selectedCurrency]).toFixed(2);
    const symbol = getCurrencySymbol(selectedCurrency);
    
    resultElement.textContent = `${amountInUSD} USD = ${symbol}${convertedAmount} ${selectedCurrency}`;
    resultElement.classList.add("show");
    showNotification("Currency converted successfully!", "success");
}

function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }, 100);
}
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    .notification.success {
         background: #5557d9;
    }

    .notification.error {
        background: #E74C3C;
    }
`;
document.head.appendChild(style);
fetchCurrencyRates();
const amountInput = document.getElementById("amount");
amountInput.addEventListener("input", function(e) {
    let value = e.target.value;
    value = value.replace(/[^\d.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
    }
    if (parts.length === 2 && parts[1].length > 2) {
        value = parseFloat(value).toFixed(2);
    } 
    e.target.value = value;
});
