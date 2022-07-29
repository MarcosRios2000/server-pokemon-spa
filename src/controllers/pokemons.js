const { Pokemon, Type } = require("../db.js");
const { v4: uuidv4 } = require("uuid");
const { updateTypes } = require("../controllers/types");
const axios = require("axios");

async function requestPokemons(req, res, next) {
  try {
    const API_Answer = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=151"
    );
    const API_Pokemons = [];
    for await (const element of API_Answer.data.results) {
      const r = await axios.get(element.url);
      const response = r.data;

      const pokemon = {
        id: response.id,
        name: response.name,
        image: response.sprites.other["official-artwork"].front_default,
        healthpoints: response.stats[0].base_stat,
        attack: response.stats[1].base_stat,
        defense: response.stats[2].base_stat,
        speed: response.stats[5].base_stat,
        height: response.height,
        weight: response.weight,
        types: response.types.map((el) => ({
          name: el.type.name,
          image: `https://typedex.app/types/${el.type.name}.png`,
        })),
      };
      API_Pokemons.push(pokemon);
    }
    return API_Pokemons;
  } catch {
    (err) => {
      console.log("An error has been detected at requestPokemons.");
      next(err);
    };
  }
}

function getAllPokemons(req, res, next) {
  return Pokemon.findAll({
    include: {
      model: Type,
      attributes: {
        include: ["name"],
        exclude: ["createdAt", "updatedAt"],
      },
      through: { attributes: [] },
    },
  })
    .then((pkmList) => {
      return pkmList;
    })
    .catch((err) => {
      console.log("An error has been detected at getAllPokemons.");
      next(err);
    });
}

async function getPokemonById(req, res, next) {
  const id = req.params.id;
  if (id.length > 10) {
    Pokemon.findOne({
      where: {
        id: id,
      },
      include: {
        model: Type,
        attributes: {
          include: ["name"],
          exclude: ["createdAt", "updatedAt"],
        },
        through: { attributes: [] },
      },
    })
      .then((pkm) => {
        res.send(pkm);
      })
      .catch((err) => {
        console.log("An error has been detected at getPokemonById.");
        next(err);
      });
  } else {
    try {
      const answer = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const response = answer.data;
      const pokemon = {
        id: response.id,
        name: response.name,
        image: response.sprites.other["official-artwork"].front_default,
        healthpoints: response.stats[0].base_stat,
        attack: response.stats[1].base_stat,
        defense: response.stats[2].base_stat,
        speed: response.stats[5].base_stat,
        height: response.height,
        weight: response.weight,
        types: response.types.map((el) => ({
          name: el.type.name,
          image: `https://typedex.app/types/${el.type.name}.png`,
        })),
      };
      res.send(pokemon);
    } catch {
      (err) => {
        console.log("An error has been detected at getPokemonById.");
        next(err);
      };
    }
  }
}

async function getPokemonByName(req, res, next) {
  const { name } = req.query;
  const pkm = await Pokemon.findOne({
    where: {
      name: name,
    },
    include: {
      model: Type,
      attributes: {
        include: ["name"],
        exclude: ["createdAt", "updatedAt"],
      },
      through: { attributes: [] },
    },
  });
  if (pkm === null) {
    try {
      const answer = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      const response = answer.data;
      const pokemon = {
        id: response.id,
        name: response.name,
        image: response.sprites.other["official-artwork"].front_default,
        healthpoints: response.stats[0].base_stat,
        attack: response.stats[1].base_stat,
        defense: response.stats[2].base_stat,
        speed: response.stats[5].base_stat,
        height: response.height,
        weight: response.weight,
        types: response.types.map((el) => ({
          name: el.type.name,
          image: `https://typedex.app/types/${el.type.name}.png`,
        })),
      };
      res.send(pokemon);
    } catch {
      (err) => {
        console.log("An error has been detected at getPokemonByName.");
        next(err);
      };
    }
  } else {
    res.send(pkm);
  }
}
async function addPokemon(req,res,next) {
  await updateTypes()
  const {name, image, healthpoints, attack, defense, speed, height, weight, types} = req.body;
  try{
      const new_pokemon = await Pokemon.create({
          id: uuidv4(),
          name,
          image,
          healthpoints,
          attack,
          defense,
          speed,
          height,
          weight
      })
      solved_types = types?.map(type => type.name)
      await new_pokemon.addTypes(solved_types)
      console.log(new_pokemon.id)
       res.send(new_pokemon)
  }catch(err){{
      console.log('An error has been detected at getPokemonById.')
      next(err)
  }}
}

module.exports = {
  requestPokemons,
  getAllPokemons,
  getPokemonById,
  getPokemonByName,
  addPokemon,
};
