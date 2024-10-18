const information = document.getElementById("information");
const codePostal = document.getElementById("cp");
const erreur = document.getElementById("errorMessage");
const communeSelect = document.getElementById("communeSelect");
const bouttonSubmit = document.getElementById("submit");
const divMeteo = document.getElementById("infoMeteo");
const form = document.getElementById("formulaire");
const nbJours = document.getElementById("nbJours");
const checkboxLatitude = document.getElementById("checkboxLatitude");
const checkboxLongitude = document.getElementById("checkboxLongitude");
const checkboxPluie = document.getElementById("checkboxPluie");
const checkboxVitesseVent = document.getElementById("checkboxVitesseVent");
const checkboxDirectionVent = document.getElementById("checkboxDirectionVent");
const fieldset = document.getElementById("option");
const labelSelect = document.getElementById("labelSelect");
codePostal.value = "";
var communes = [];

class weatherCard {
    min;
    max; 
    lat; 
    long; 
    cummul; 
    vitesse;
    direction;

    constructor(min, max, lat, long, cummul, vitesse, direction) {
      this.min = min;
      this.max = max;
      this.lat = lat;
      this.long = long;
      this.cummul = cummul;
      this.vitesse = vitesse;
      this.direction = direction;
    }
}

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
                fieldset.classList.remove("cache");
                bouttonSubmit.classList.remove("cache");
                communeSelect.classList.remove("cache");
                labelSelect.classList.remove("cache");
            }
        });
    } else {
        communeSelect.replaceChildren();
        fieldset.classList.add("cache");
        labelSelect.classList.add("cache")
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
            /*creeElementMeteo(json);
            creeElementMeteoTemplate(json)*/
           if ("content" in document.createElement("template")) {
                creeElementMeteoTemplate(json)
            } else {
                creeElementMeteo(json);
            }

        }
    })
    e.preventDefault();
});

function creeElementMeteoTemplate(json){
    console.log(json);
    let nb_jour = nbJours.value;
    let tabDesTextes ={
      "tmin" : "Température Min: ",
      "tmax" : "Température Max: ",
      "probarain" : "Proba pluie: ",
      "sun_hours" : "Heure ensoleillement: ",
  
    }
    var template = document.getElementById("infoMeteo");
    for( let i = 0; i < nb_jour; i++){ 
        var clone = document.importNode(template.content, true);
        for(const [key,value] of Object.entries(tabDesTextes)){
            var p = clone.querySelector(".contenu").cloneNode();
            p.textContent = `${value}` + json[i][`${key}`];
            if (`${key}` == "tmin" || `${key}` == "tmax" ){
                p.textContent += "°C";
            }
            if (`${key}` == "probarain"){
                p.textContent += "%";
            }
            if (`${key}` == "sun_hours"){
                p.textContent += "h";
            }
            clone.querySelector(".divTemplate").appendChild(p);            
           // clone.querySelector(".contenu").textContent = `${value}` + json[i][`${key}`];              
        }
        var img = clone.querySelector(".image");
        var codeMeteo =  json[i]["weather"];   
        if(codeMeteo == 0){
                img.src = "../image/soleil.png";
        }
        if(codeMeteo == 1){
            img.src = "../image/eclaircies1.png";
        }
        if(codeMeteo == 2){
            img.src = "../image/eclaircies2.png";
        }
        if(codeMeteo >= 3 && codeMeteo <= 6){
            img.src = "../image/nuageux.png";
        }
        if(codeMeteo == 220 || codeMeteo == 221 || codeMeteo == 20 || codeMeteo == 21 || codeMeteo == 7){
            img.src = "../image/faible_neige.png";
        }
        if(codeMeteo == 10 || codeMeteo == 16 || codeMeteo == 210){
            img.src = "../image/faible_pluie.png";
        }
        if(codeMeteo == 11 || codeMeteo == 211){
            img.src = "../image/forte_pluie.png";
        }
        if(codeMeteo == 12 || codeMeteo == 212){
            img.src = "../image/forte_pluie_vent.png";
        }
        if(codeMeteo == 13 || codeMeteo == 14 || codeMeteo == 30 || codeMeteo == 31){
            img.src = "../image/faible_grele.png";
        }
        if(codeMeteo == 15 || codeMeteo == 32 || codeMeteo >= 230){
            img.src = "../image/forte_grele.png";
        }
        if(codeMeteo == 22 || codeMeteo == 222){
            img.src = "../image/forte_neige.png";
        }
        if((codeMeteo >= 40 && codeMeteo <= 48  )|| (codeMeteo >= 70 && codeMeteo <= 78  )){
            img.src = "../image/soleil_pluie.png";
        }
        if((codeMeteo >= 60 && codeMeteo <= 68  )){
            img.src = "../image/soleil_neige.png";
        }
        if((codeMeteo >= 100 && codeMeteo <= 108  )){
            img.src = "../image/orage_sans_pluie.png";
        }
        if((codeMeteo >= 120 && codeMeteo <= 142  )){
            img.src = "../image/orage_pluie.png";
        }
        information.appendChild(clone);
    }
}



function creeElementMeteo(json){
    let nb_jour = nbJours.value;
    let tabDesTextes ={
      "tmin" : "Température Min: ",
      "tmax" : "Température Max: ",
      "probarain" : "Proba pluie: ",
      "sun_hours" : "Heure ensoleillement: ",
  
    }
    for( let i = 0; i < nb_jour; i++){
      const subMeteo = document.createElement('div');
      subMeteo.classList.add("divTemplate");
      const dat = new Date(json[i]["datetime"]);
      const dateJour = document.createElement('h3');
      dateJour.textContent =dat.toDateString();
      subMeteo.append(dateJour);
      for(const [key,value] of Object.entries(tabDesTextes)){
        const baliseP = document.createElement('p');
        baliseP.textContent = `${value}` + json[i][`${key}`];
        subMeteo.append(baliseP)
      }
      information.append(subMeteo)
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
        //let reponse = json["forecast"][0]; // meteo sur 1 jour
        return reponse;
    } catch (error) {
        return -1;
    }

}

