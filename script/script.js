const information = document.getElementById("information");
const codePostal = document.getElementById("cp");

codePostal.addEventListener("keypress", (e)=>{
    if (codePostal.value.length > 4) {   
        codePostal.value = codePostal.value.slice(0,4);
    }
}, false )