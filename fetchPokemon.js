const { createWriteStream } = require("fs")
const fetch = require("isomorphic-fetch");


async function fetchPokemon(){

    const res = await fetch(
        "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json"
        );
    const arrayBuffer = await res.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const writeStream = createWriteStream("./pokemon.json");
    writeStream.write(buffer);


}
fetchPokemon();
