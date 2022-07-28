const { Type } = require("../db.js");
const axios = require("axios");

async function requestAllTypes(req, res, next) {
  try {
    const answer = await axios.get("https://pokeapi.co/api/v2/type/?limit=18");
    const data = answer.data.results;
    return data;
  } catch {
    (err) => {
      console.log("An error has been detected at requestAllTypes.");
      next(err);
    };
  }
}

async function updateTypes(req, res, next) {
  try {
    const typeList = await requestAllTypes();
    for await (const element of typeList) {
      await Type.create({
        name: element.name,
        image: `https://typedex.app/types/${element.name}.png`,
      });
    }
    console.log("Types updated succesfully.");
  } catch {
    (err) => {
      console.log("An error has been detected at updateTypes.");
      next(err);
    };
  }
}

async function dbTypes(req, res, next) {
  const answer = await Type.findAll({
    attributes: {
      include: ["name", "image"],
      exclude: ["createdAt", "updatedAt"],
    },
  });
  try {
    res.send(answer);
  } catch {
    (err) => {
      console.log("An error has been detected at dbTypes.");
      next(err);
    };
  }
}

module.exports = {
  updateTypes,
  dbTypes,
};
