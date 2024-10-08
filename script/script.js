const information = document.getElementById("information");
const codePostal = document.getElementById("cp");
const erreur = document.getElementById("errorMessage");
const communeSelect = document.getElementById("communeSelect");
const bouttonSubmit = document.getElementById("submit");
var communes = [];
var inse;

codePostal.addEventListener("input", (e) => {
    console.log(codePostal.value.length);
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

bouttonSubmit.addEventListener("click", (e) => {
    console.log(communes);
    inse = communes[communeSelect.selectedIndex]["code"];
    console.log(inse);
    e.preventDefault();
});
   

