const BASE_URL = "https://api.frankfurter.app/latest";
const CURRENCY_LIST_URL = "https://api.frankfurter.app/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

let supportedCurrencies = {};

// Fetch supported currencies dynamically
async function loadCurrencies() {
  try {
    let response = await fetch(CURRENCY_LIST_URL);
    supportedCurrencies = await response.json();

    // Populate dropdowns
    for (let select of dropdowns) {
      for (let currCode in supportedCurrencies) {
        if (countryList[currCode]) {
          let newOption = document.createElement("option");
          newOption.innerText = `${currCode} - ${supportedCurrencies[currCode]}`;
          newOption.value = currCode;

          if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
          } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
          }

          select.append(newOption);
        }
      }

      select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
      });
    }

    updateExchangeRate(); // default fetch
  } catch (error) {
    console.error("Error loading currencies:", error);
    msg.innerText = "⚠️ Could not load currency list!";
  }
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value);

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}?amount=${amtVal}&from=${fromCurr.value}&to=${toCurr.value}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    if (data && data.rates && data.rates[toCurr.value]) {
      let finalAmount = Number(data.rates[toCurr.value]).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } else {
      msg.innerText = "⚠️ Could not fetch exchange rate!";
    }
  } catch (error) {
    console.error("Error:", error);
    msg.innerText = "❌ Network error, please try again.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load currencies on startup
window.addEventListener("load", loadCurrencies);
