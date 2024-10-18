const information = document.getElementById("information");
const codePostal = document.getElementById("cp");
const erreur = document.getElementById("errorMessage");
const communeSelect = document.getElementById("communeSelect");
const bouttonSubmit = document.getElementById("submit");
const divMeteo = document.getElementById("infoMeteo");
const form = document.getElementById("formulaire");
const nbJours = document.getElementById("nbJours");
const fieldset = document.getElementById("option");
const labelSelect = document.getElementById("labelSelect");
codePostal.value = "";
var communes = [];

let tabDesTextes ={
    "tmin" : "Température Min: ",
    "tmax" : "Température Max: ",
    "probarain" : "Proba pluie: ",
    "sun_hours" : "Heure ensoleillement: ",

  }

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
            lectureCheckbox();
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
    let nb_jour = nbJours.value;
    var template = document.getElementById("infoMeteo");
    for( let i = 0; i < nb_jour; i++){ 
        const dat = new Date(json[i]["datetime"]);
        var clone = document.importNode(template.content, true);
        var h3 = clone.querySelector(".dateJour")
        h3.textContent = traductionJour(dat.toDateString(),i)
        //clone.querySelector(".divTemplate").appendChild(h3)
        for(const [key,value] of Object.entries(tabDesTextes)){
            var p = clone.querySelector(".contenu").cloneNode();
            p.textContent = `${value}` + json[i][`${key}`];
            clone.querySelector(".infoPrincipal").appendChild(p);                        
        }
        information.appendChild(clone);
    }
}

function lectureCheckbox(){
    var tabCheckbox = document.getElementsByClassName("checkbox_info")
    for(let i = 0; i < tabCheckbox.length; i++){
        let valeur = tabCheckbox[i].value;
        let nom = tabCheckbox[i].getAttribute("name");
        tabCheckbox[i].checked?(tabDesTextes[nom]= valeur):(null);
    }
}

function traductionJour(textDat,i){
    switch (i){
        case 0 : return "Aujourd'hui"
        case 1 :return "Demain"
    }
    switch(textDat.slice(0,3)){
        case "Mon" : return "Lundi"
        case "Tue" : return "Mardi"
        case "Wed" : return "Mercredi"
        case "Thu" : return "Jeudi"
        case "Fri" : return "Vendredi"
        case "Sat" : return "Samedi"
        case "Sun" : return "Dimanche"
        

    }
}



function init_tabDesTextes(){
    tabDesTextes ={
        "tmin" : "Température Min: ",
        "tmax" : "Température Max: ",
        "probarain" : "Proba pluie: ",
        "sun_hours" : "Heure ensoleillement: ",
    
      }
}

function creeElementMeteo(json){
    let nb_jour = nbJours.value;
    console.log(tabDesTextes)
    for( let i = 0; i < nb_jour; i++){
      const subMeteo = document.createElement('div');
      subMeteo.classList.add("divTemplate");
      const dat = new Date(json[i]["datetime"]);
      const dateJour = document.createElement('h3');
      dateJour.textContent =traductionJour(dat.toDateString(),i)
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

