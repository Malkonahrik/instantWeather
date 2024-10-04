const information = document.getElementById("information");
const codePostal = document.getElementById("cp");

codePostal.addEventListener("keypress", (e) => {
    if (e.target.type === "number" && !e.key.match(/^[0-9]+$/)) {
        e.preventDefault();
    }
    if (codePostal.value.length > 4) {
        codePostal.value = codePostal.value.slice(0, 4);
    }
    if (codePostal.value.length == 4) {
        codePostal.value = codePostal.value + e.key; 
        getData().then((json) =>{
        for (var i = 0; i < json.length; i++) {
            console.log(json[i]);
        }})
        console.log("json");
        e.preventDefault();
    }
}, false);

async function getData() {
    const url = "https://geo.api.gouv.fr/communes?codePostal=" + codePostal.value;
    console.log(url)
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        var json = await response.json();
        let machin = json[0]["nom"];
        return json;
    } catch (error) {
        console.error(error.message);
    }
}