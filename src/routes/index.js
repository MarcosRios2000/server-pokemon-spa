const { Router } = require("express");
const {
  requestPokemons,
  getAllPokemons,
  getPokemonById,
  getPokemonByName,
  addPokemon,
} = require("../controllers/pokemons.js");
const { updateTypes, dbTypes, APITypes } = require("../controllers/types.js");

const router = Router();

updateTypes();
router.get("/pokemons", async function (req, res, next) {
  if (!req.query.name) {
    const DB_Pokemons = await getAllPokemons(req, res, next);
    const API_Pokemons = await requestPokemons(req, res, next);
    const answer = API_Pokemons.concat(DB_Pokemons);
    res.send(answer);
  } else {
    getPokemonByName(req, res, next);
  }
});

router.post("/pokemons", addPokemon);
router.get("/pokemons/:id", getPokemonById);
router.get("/types", dbTypes);
router.get("/error", function (req, res) {
  res.send("Cannot be Found!");
});
router.get("*", function (req, res) {
  res.redirect("/error");
});

module.exports = router;
