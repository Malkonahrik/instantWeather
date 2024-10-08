const information = document.getElementById("information");
const codePostal = document.getElementById("cp");
const erreur = document.getElementById("errorMessage");
const communeSelect = document.getElementById("communeSelect");
const bouttonSubmit = document.getElementById("submit");
const divMeteo = document.getElementById("infoMeteo");
const form = document.getElementById("formulaire")
var communes = [];

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
                let index = 0;
                json.forEach(element => {
                    communes[index] = element;
                    index += 1;
                    const option = document.createElement('option');
                    option.value = element["nom"].toLowerCase().replace(/\s+/g, '-');
                    option.textContent = element["nom"];
                    communeSelect.appendChild(option);
                });
                bouttonSubmit.classList.remove("cache");
                communeSelect.classList.remove("cache");
            }
        });
    } else {
        communeSelect.replaceChildren();
        communeSelect.classList.add("cache");
        bouttonSubmit.classList.add("cache");
    }
}, false);

bouttonSubmit.addEventListener("click", (e) => {
    let inse = communes[communeSelect.selectedIndex]["code"];
    getDataMeteo(inse).then((json) => {
        if (json == -1) {
            erreur.classList.remove("cache");
        } else {
            erreur.classList.add("cache");
            form.classList.add("cache");
            creeElementMeteo(json);
            /*const balisePTemperatureMin = document.createElement('p').textContent = json["tmin"];
            const balisePTemperatureMax = document.createElement('p').textContent = json["tmax"];
            const balisePProbaPluie = document.createElement('p').textContent = json["probarain"];
            const balisePHeureSoleil = document.createElement('p').textContent = json["sun_hours"];
            divMeteo.append(balisePTemperatureMin);
            divMeteo.append(balisePTemperatureMax);
            divMeteo.append(balisePProbaPluie);
            divMeteo.append(balisePHeureSoleil);*/

        }
    })
    e.preventDefault();
});

function creeElementMeteo(json){
  let nb_jour = 7;
  let tabDesTextes ={
    "tmin" : "Température Min: ",
    "tmax" : "Température Max: ",
    "probarain" : "Proba pluie: ",
    "sun_hours" : "Heure ensoleillement: ",

  }
  for( let i = 0; i < nb_jour; i++){
    const subMeteo = document.createElement('div');
    const dat = new Date(json[i]["datetime"]);
    const dateJour = document.createElement('h3');
    dateJour.textContent =dat.toDateString();
    subMeteo.append(dateJour);
    for(const [key,value] of Object.entries(tabDesTextes)){
      const baliseP = document.createElement('p');
      baliseP.textContent = `${value}` + json[i][`${key}`];
      subMeteo.append(baliseP)
    }
    divMeteo.append(subMeteo)
  }

}

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

async function getDataMeteo(inse) {
    const url = "https://api.meteo-concept.com/api/forecast/daily?token=75e38b3c4f84616e8c5d703a6a6271ffcdad018bac865662eeb3f8b5766bec42&insee=" + inse;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        var json = await response.json();
        let reponse = json["forecast"]; // meteo sur 1 jour
        return reponse;
    } catch (error) {
        return -1;
    }
}