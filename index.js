const axios =  require('axios');
const { map } = require('./src/app.js');
const { Type } = require("./src/db.js");
const server = require('./src/app.js');
const { conn } = require('./src/db.js');

conn.sync({ force: true })
.then(async () => {

    try {
      const typeList = await axios.get("https://pokeapi.co/api/v2/type/?limit=18")
      const types = typeList.data.results;
      const mapTypes = types.map(el => {
        return {
          name:el.name,
          image:`https://typedex.app/types/${el.name}.png`
        }
      })
      mapTypes.forEach(async (el) => await Type.create(el))
      console.log("Tipos precargados")
    } catch {
      (err) => {
        console.log("An error has been detected at updateTypes.");
        next(err);
      };
    }

    const PORT = process.env.PORT || 3001
  server.listen(PORT, () => {
    console.log(`listening to ${PORT}`); 
  });
})
.catch(()=>{
  console.log("Couldn't sync with Database")
})
