/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Pokemon, conn } = require('../../src/db.js');

const agent = session(app);
const pokemon = {
  name: 'Pikachu',
};

describe('Pokemon routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Pokemon.sync({ force: true })
    .then(() => Pokemon.create(pokemon)));
  describe('GET /pokemons', () => {
    it('should res 200', (done) => {
      agent.get('/pokemons').expect(200)
      done();
    });
    it('should return 40 pokemons', (done) => {
      agent.get('/pokemons')
      .then(res => expect(res.body.API_Pokemons.length).to.be.equal(40))
      done();
    })
    it('should search by name', (done) => {
      agent.get('/pokemons?name=charizard')
      .then(res => expect(res.body.name).to.be.equal('charizard'))
      done();
    })
    it('should search by id', () => {
      agent.get('/pokemons/1').then((res) => {
        expect(res.body)
      })
    })
  });

  describe('POST /pokemons', () => {
    it('should create a new pokemon', () => {
      agent.post('/pokemons')
      .send({
        "name": "alverso",
        "image": "https://bichosdecampo.com/wp-content/uploads/2021/03/polenta-3.jpg",
        "healthpoints": 10,
        "attack": 10,
        "defense": 10,
        "speed": 10,
        "height": 10,
        "weight": 1000,
        "types": [
            {"name":"flying"},
            {"name": "bug"}
        ]
      })
      .then(res => {
        expect(res.body.name).to.be.equal('alverso')
      });
    });
  });

  describe('GET /asdasd', () => {
    it('should return get error at invalid route', () => {
      agent.get('/asdasd').then(res => {
        expect(res.body).to.be.equal("Cannot be Found!")
      })
    })
  })

  describe('GET /types', () => {
    it('should return 18 types', () =>{
      agent.get('/types').then(res => {
        expect(res.body.length).to.be.equal(18)
      })
    })
  })
});
