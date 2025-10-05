const list = document.getElementById("list");
const result = document.getElementById("result");
const portionBlock = document.getElementById("portionBlock");
const portionInput = document.getElementById("portion");
const portionResult = document.getElementById("portionResult");
const clearBtn = document.getElementById("clearHistory");
const storageKey = "ujarkaHistory";
let currentPercent = null;

function load(){ return JSON.parse(localStorage.getItem(storageKey)||"[]"); }
function save(arr){ localStorage.setItem(storageKey, JSON.stringify(arr)); }

function render(){
  list.innerHTML = "";
  const data = load();
  if (data.length === 0) {
    list.innerHTML = "<small>История пуста</small>";
    return;
  }
  data.forEach(item=>{
    const div = document.createElement("div");
    div.className="item";
    div.innerHTML = `<strong>${item.percent.toFixed(1)}%</strong> (${item.before}г → ${item.after}г) <br><small>${item.date}</small>`;
    list.appendChild(div);
  });
}

document.getElementById("calc").onclick = ()=>{
  const before = +document.getElementById("before").value;
  const after = +document.getElementById("after").value;
  if(!before || !after){ alert("Заполни оба поля"); return; }
  currentPercent = (before - after) / before;
  const percentValue = currentPercent * 100;
  result.textContent = `Ужарка котлеток: ${percentValue.toFixed(1)}%`;

  const history = load();
  history.unshift({before, after, percent: percentValue, date:new Date().toLocaleString()});
  save(history.slice(0,50));
  render();

  portionBlock.style.display = "block";
  portionInput.value = "";
  portionResult.textContent = "";
};

portionInput.addEventListener("input", () => {
  const portion = +portionInput.value;
  if (!portion || currentPercent === null) {
    portionResult.textContent = "";
    return;
  }
  const rawEquivalent = portion / (1 - currentPercent);
  portionResult.textContent = `Это примерно ${rawEquivalent.toFixed(1)} г сырого продукта`;
});

clearBtn.addEventListener("click", () => {
  if (confirm("Очистить историю?")) {
    save([]);
    render();
  }
});

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./service-worker.js");
}

render();
