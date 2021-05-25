const searchForm = document.getElementById("search-form");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const btn_conf_asc = document.getElementById("conf_asc");
const btn_conf_desc = document.getElementById("conf_desc");
const btn_death_asc = document.getElementById("death_asc");
const btn_death_desc = document.getElementById("death_desc");
const refresh = document.getElementById("refresh");
let searchTerm = "";
const URL = "https://api.covid19api.com/summary";

refresh.addEventListener("click", (e) => {
  console.log("refresh");
  e.preventDefault();
  localStorage.setItem("covid", "");
});

searchInput.addEventListener("keyup", async (e) => {
  e.preventDefault();
  if (e.key == "Backspace") {
    searchTerm = searchTerm.slice(0, -1);
  } else {
    searchTerm += e.key;
  }
  console.log(searchTerm);
  let data = await fetchData(URL);
  data = JSON.parse(data);
  data = data.filter((s) => s.Country.toLowerCase().includes(searchTerm));
  show(data);
});

async function sort(fn) {
  let data = await fetchData(URL);
  data = JSON.parse(data);
  return data.sort(fn);
}

btn_conf_asc.addEventListener("click", async (e) => {
  e.preventDefault();
  show(await sort((a, b) => b.TotalConfirmed - a.TotalConfirmed));
});
btn_conf_desc.addEventListener("click", async (e) => {
  e.preventDefault();
  show(await sort((a, b) => a.TotalConfirmed - b.TotalConfirmed));
});
btn_death_asc.addEventListener("click", async (e) => {
  e.preventDefault();
  show(await sort((a, b) => b.TotalDeaths - a.TotalDeaths));
});
btn_death_desc.addEventListener("click", async (e) => {
  e.preventDefault();
  show(await sort((a, b) => a.TotalDeaths - b.TotalDeaths));
});

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = await fetchData(URL);
  show(JSON.parse(data));
});

async function fetchData(url) {
  if (localStorage.getItem("covid")) {
    //console.log("data from ls!");
    return localStorage.getItem("covid");
  }
  let resp = await fetch(url);
  let data = await resp.json();

  //console.log("fetched data!");
  const countriesArray = data.Countries;
  localStorage.setItem("covid", JSON.stringify(countriesArray));
  return JSON.stringify(countriesArray);
}

function show(data) {
  let output = '<div class="container">';
  output += `
    <div class="row font-weight-bold">
     <div class="col font-weight-bold">
      Country
     </div>
     <div class="col font-weight-bold">
      Total Confirmed
     </div>
     <div class="col font-weight-bold">
     Total Deaths
     </div>
    </div>  
      `;
  data.forEach(({ Country, TotalConfirmed, TotalDeaths }) => {
    output += `
    <div class="row">
     <div class="col">
      ${Country}
     </div>
     <div class="col">
     ${TotalConfirmed.toLocaleString()}
     </div>
     <div class="col">
      ${TotalDeaths.toLocaleString()}
     </div>
    </div>  
      `;
  });
  output += "</div>";
  document.getElementById("results").innerHTML = output;
}
