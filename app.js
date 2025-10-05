const list = document.getElementById("list");
const result = document.getElementById("result");
const storageKey = "ujarkaHistory";

function load(){ return JSON.parse(localStorage.getItem(storageKey)||"[]"); }
function save(arr){ localStorage.setItem(storageKey, JSON.stringify(arr)); }

function render(){
  list.innerHTML = "";
  load().forEach(item=>{
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
  const percent = ((before - after) / before) * 100;
  result.textContent = `Ужарка: ${percent.toFixed(1)}%`;
  const history = load();
  history.unshift({before, after, percent, date:new Date().toLocaleString()});
  save(history.slice(0,50));
  render();
};

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./service-worker.js");
}

render();
