/*let champsCodePostal = document.getElementById("cp")

champsCodePostal.addEventListener("input",(e)=>{
    if(champsCodePostal.value.length == 5 && champsCodePostal.value < "99139" ){
        console.log(getDataCommune())
        let reponseAPICommune = getDataCommune()
        new inputCommune = document.createElement("input")
        for(let i = 0; i < reponseAPICommune.length  )
    }

})

async function getDataCommune() {
    const url = "https://geo.api.gouv.fr/communes?codePostal="+champsCodePostal.value;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
        return await response.json();
    } catch (error) {
      console.error(error.message);
    }
  }
  */



  //getDataCommune()



  async function getData() {
    const url = "https://geo.api.gouv.fr/communes?codePostal=50000";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json[0]["nom"])
      let machin = json[0]["nom"];
      return machin;
    } catch (error) {
      console.error(error.message);
    }
  }
  console.log(getData())



/*async function getData() {
    const url = "https://api.meteo-concept.com/api/ephemeride/0?token=75e38b3c4f84616e8c5d703a6a6271ffcdad018bac865662eeb3f8b5766bec42";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json;
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  console.log("test")
  getData()*/
