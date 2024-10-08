const information = document.getElementById("information");
const codePostal = document.getElementById("cp");
const erreur = document.getElementById("errorMessage");
const communeSelect = document.getElementById("communeSelect");
const boutonSubmitCommune = document.getElementById("submit");
const divMeteo = document.getElementById("infoMeteo");

codePostal.addEventListener("input", (e) => {
    if (e.target.type === "number" && !e.key.match(/^[0-9]+$/)) {
        e.preventDefault();
    }
    if (codePostal.value.length > 5) {
        codePostal.value = codePostal.value.slice(0, 5);
    }
    if (codePostal.value.length == 5) {
        getData().then((json) => {
            if (json == -1) {
                erreur.classList.remove("cache");
            } else {
                erreur.classList.add("cache");
                json.forEach(element => {
                    const option = document.createElement('option');
                    option.value = element["nom"].toLowerCase().replace(/\s+/g, '-');
                    option.textContent = element["nom"];
                    communeSelect.appendChild(option);
                });
                communeSelect.classList.remove("cache");
            }
        });
    } else {
        communeSelect.replaceChildren();
        communeSelect.classList.add("cache");
    }
}, false);

boutonSubmitCommune.addEventListener("click",(e)=>{
  getDataMeteo().then((json)=>{
    if (json == -1) {
      console.log("erreur");
      erreur.classList.remove("cache");
  } else {
    console.log("ça passe");
      erreur.classList.add("cache");
      const balisePTemperatureMin = document.createElement('p').textContent = json["tmin"];
      const balisePTemperatureMax = document.createElement('p').textContent =  json["tmax"];
      const balisePProbaPluie = document.createElement('p').textContent = json["probarain"];
      const balisePHeureSoleil = document.createElement('p').textContent = json["sun_hours"];
      divMeteo.append(balisePTemperatureMin);
      divMeteo.append(balisePTemperatureMax);
      divMeteo.append(balisePProbaPluie);
      divMeteo.append(balisePHeureSoleil);

  }
})
})



async function getData() {
    const url = "https://geo.api.gouv.fr/communes?codePostal=" + codePostal.value;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        var json = await response.json();
        let machin = json[0]["nom"];
        return json;
    } catch (error) {
        return -1;
    }
}

async function getDataMeteo() {
  const url = "https://api.meteo-concept.com/api/forecast/daily?token=75e38b3c4f84616e8c5d703a6a6271ffcdad018bac865662eeb3f8b5766bec42&insee=35238";
  console.log("datameteo")
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }
      var json = await response.json();
      let reponse = json["forecast"][0]; // meteo sur 1 jour
      console.log(reponse);
      return reponse;
  } catch (error) {
      return -1;
  }
}

