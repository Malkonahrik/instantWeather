//Récupération des élément important dans des constantes
const information = document.getElementById("information");
const codePostal = document.getElementById("cp");
const erreur = document.getElementById("errorMessage");
const communeSelect = document.getElementById("communeSelect");
const bouttonSubmit = document.getElementById("submit");
const divMeteo = document.getElementById("infoMeteo");
const form = document.getElementById("formulaire");
const nbJours = document.getElementById("nbJours");
const compteurNbJour = document.getElementById("compteurNbJours");
const fieldset = document.getElementById("option");
const labelSelect = document.getElementById("labelSelect");

//Déclaration des variables globals et initialisation 
codePostal.value = "";
compteurNbJour.textContent = nbJours.value;
var communes = [];

let tabDesTextes = {
    "tmin": "Température Min: ",
    "tmax": "Température Max: ",
    "probarain": "Proba pluie: ",
    "sun_hours": "Heure ensoleillement: ",

}


/*
* Listener avant input du champs code postal
* Evite l'insertion de caractère autre que des entiers
*/
codePostal.addEventListener("beforeinput", (e) => {
    console.log("test")
    if (e.inputType !== "deleteContentBackward" && e.inputType !== "deleteContentForward") {
        if (RegExp("[a-zA-Z]").test(e.data)) {
            e.preventDefault();
        }
    }
});


/*
* Listener des input du champs code postal
* Limite le nombre de caractère à 5
* Si il y a 5 caractère alors recherche dans l'API si les communes associées
* Si aucune commune n'est associé (CP invalide) alors affiche un message d'erreur
* Sinon affiche le reste du formulaire avec un select remplis des différentes commune retourné
* Si il y a moins de caractère alors vide le select et cache le reste du formulaire
*
* @see getData()
*/
codePostal.addEventListener("input", (e) => {
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


/*
* Listener de click sur le bouton valider
* Récupere le code INSE de la commune selectionné et l'utilise avec l'API Météo
* Récupere les données météo puis cache l'intégralité du formulaire
* Appel les fonctions d'affichage
*
* @see lectureCheckbox()
* @see creeElementMeteoTemplate()
* @see creeElementMeteo()
*/
bouttonSubmit.addEventListener("click", (e) => {
    let inse = communes[communeSelect.selectedIndex]["code"];
    getDataMeteo(inse).then((json) => {
        if (json == -1) {
            alert("Impossible de récupérer les données météo. Ce problème vient du serveur.");
        } else {
            form.classList.add("cache");
            lectureCheckbox();
            if ("content" in document.createElement("template")) {
                creeElementMeteoTemplate(json);
            } else {
                creeElementMeteo(json);
            }

        }
    })
    e.preventDefault();
});


/*
* Listener de changement de la barre de selection (range) 
* Modifie le compteur en fonction de la valeur de la barre
*/
nbJours.addEventListener("input", (e) => {
    compteurNbJour.textContent = nbJours.value;
});


/*
* Créer et affiche les templates en fonction des options selectionnées et des données receuillis
*
* @param {Promise} json Résultat de la promesse de l'API Météo
*/
function creeElementMeteoTemplate(json) {
    console.log(json);
    let nb_jour = nbJours.value;
    var template = document.getElementById("infoMeteo");
    for (let i = 0; i < nb_jour; i++) {
        const dat = new Date(json[i]["datetime"]);
        var clone = document.importNode(template.content, true);
        var h2 = clone.querySelector(".dateJour")
        h2.textContent = traductionJour(dat.toDateString(), i)
        for (const [key, value] of Object.entries(tabDesTextes)) {
            var p = clone.querySelector(".contenu").cloneNode();
            p.textContent = `${value}` + json[i][`${key}`];
            if (`${key}` == "tmin" || `${key}` == "tmax") {
                p.textContent += "°C";
            }
            if (`${key}` == "probarain") {
                p.textContent += "%";
            }
            if (`${key}` == "sun_hours") {
                p.textContent += "h";
            }
            if (`${key}` == "rr1") {
                p.textContent += "mm";
            }
            if (`${key}` == "wind10m") {
                p.textContent += "km/h";
            }
            if (`${key}` == "dirwind10m") {
                p.textContent += "°";
            }
            clone.querySelector(".infoPrincipal").appendChild(p);
        }
        var img = clone.querySelector(".image");
        var codeMeteo = json[i]["weather"];
        if (codeMeteo == 0) {
            img.src = "../image/soleil.png";
            img.alt = "Icone du soleil";
        }
        if (codeMeteo == 1) {
            img.src = "../image/eclaircies1.png";
            img.alt = "Icone d'éclaircie";
        }
        if (codeMeteo == 2) {
            img.src = "../image/eclaircies2.png";
            img.alt = "Icone d'éclaircie";
        }
        if (codeMeteo >= 3 && codeMeteo <= 6) {
            img.src = "https://malkonahrik.github.io/instantWeather/image/nuage.png";
            img.alt = "Icone de nuage";
        }
        if (codeMeteo == 220 || codeMeteo == 221 || codeMeteo == 20 || codeMeteo == 21 || codeMeteo == 7) {
            img.src = "../image/faible_neige.png";
            img.alt = "Icone de faible neige";
        }
        if (codeMeteo == 10 || codeMeteo == 16 || codeMeteo == 210) {
            img.src = "../image/faible_pluie.png";
            img.alt = "Icone de faible pluie";
        }
        if (codeMeteo == 11 || codeMeteo == 211) {
            img.src = "../image/forte_pluie.png";
            img.alt = "Icone de forte pluie";
        }
        if (codeMeteo == 12 || codeMeteo == 212) {
            img.src = "../image/forte_pluie_vent.png";
            img.alt = "Icone de forte pluie et de vent";
        }
        if (codeMeteo == 13 || codeMeteo == 14 || codeMeteo == 30 || codeMeteo == 31) {
            img.src = "../image/faible_grele.png";
            img.alt = "Icone de faible grèle";
        }
        if (codeMeteo == 15 || codeMeteo == 32 || codeMeteo >= 230) {
            img.src = "../image/forte_grele.png";
            img.alt = "Icone de forte grèle";
        }
        if (codeMeteo == 22 || codeMeteo == 222) {
            img.src = "../image/forte_neige.png";
            img.alt = "Icone de forte neige";
        }
        if ((codeMeteo >= 40 && codeMeteo <= 48) || (codeMeteo >= 70 && codeMeteo <= 78)) {
            img.src = "../image/soleil_pluie.png";
            img.alt = "Icone du soleil et de pluie";
        }
        if ((codeMeteo >= 60 && codeMeteo <= 68)) {
            img.src = "../image/soleil_neige.png";
            img.alt = "Icone du soleil et de neige";
        }
        if ((codeMeteo >= 100 && codeMeteo <= 108)) {
            img.src = "../image/orage_sans_pluie.png";
            img.alt = "Icone d'orage";
        }
        if ((codeMeteo >= 120 && codeMeteo <= 142)) {
            img.src = "../image/orage_pluie.png";
            img.alt = "Icone d'orage et de pluie";
        }
        information.appendChild(clone);
    }
}


/*
* Vérifie quelles checkbox sont cochée puis les ajoute au tableau
*/
function lectureCheckbox() {
    var tabCheckbox = document.getElementsByClassName("checkbox_info")
    for (let i = 0; i < tabCheckbox.length; i++) {
        let valeur = tabCheckbox[i].value;
        let nom = tabCheckbox[i].getAttribute("name");
        tabCheckbox[i].checked ? (tabDesTextes[nom] = valeur) : (null);
    }
}


/*
* Traduit les jours en français
*
* @param {text} textDat Les initiales du jour en anglais
* @param {integer} i L'index associé au jours (0 = aujourd'hui, 1 = demain etc...)
*/
function traductionJour(textDat, i) {
    switch (i) {
        case 0: return "Aujourd'hui"
        case 1: return "Demain"
    }
    switch (textDat.slice(0, 3)) {
        case "Mon": return "Lundi"
        case "Tue": return "Mardi"
        case "Wed": return "Mercredi"
        case "Thu": return "Jeudi"
        case "Fri": return "Vendredi"
        case "Sat": return "Samedi"
        case "Sun": return "Dimanche"


    }
}


/*
* Alternative moins poussé de l'affiche si le navigateur ne supporte pas les templates
*
* @param {Promise} json Résultat de la promesse de l'API Météo
*/
function creeElementMeteo(json) {
    let nb_jour = nbJours.value;
    console.log(tabDesTextes)
    for (let i = 0; i < nb_jour; i++) {
        const subMeteo = document.createElement('div');
        subMeteo.classList.add("divTemplate");
        const dat = new Date(json[i]["datetime"]);
        const dateJour = document.createElement('h2');
        dateJour.textContent = traductionJour(dat.toDateString(), i)
        subMeteo.append(dateJour);
        for (const [key, value] of Object.entries(tabDesTextes)) {
            const baliseP = document.createElement('p');
            baliseP.textContent = `${value}` + json[i][`${key}`];
            subMeteo.append(baliseP)
        }
        information.append(subMeteo)
    }

}


/*
* Récupère les comunnes associé au code postal selectionné
*
* @return {Promise} json La promesse de l'API commune
*/
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


/*
* Récupère les données météos associé au code INSE
*
* @param {text} inse Le code INSE
* @return {Promise} json La promesse de l'API Météo
*/
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