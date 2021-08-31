
const express = require("express");
const morgan = require("morgan");
const path = require("path")
const fs = require("fs")

const app = express();

const file = path.join(__dirname, "./pokemon.json")

app.use(morgan("dev"))

app.use(express.json())

app.get("/pokemon", (req, res, next) => {
    try {
        res.status(200).sendFile(file)
    } catch (error) {
        next(error)
    }
})

app.post("/pokemon", (req,res,next) => {
    try {
        let pokemon = req.body;

        fs.readFile(file, (err, data) => {
            if(err){
                console.log(err);
                throw err;
            }

            let pokemonArray = JSON.parse(data);
            pokemon.id = pokemonArray[pokemonArray.length - 1].id + 1;
            pokemon.num = pokemon.id.toString().padStart(3, "0");
            pokemonArray.push(pokemon);

            fs.writeFile(file, JSON.stringify(pokemonArray), (err) => {
                if(err){
                    console.log(err);
                    throw err;
                }
                res.status(200).json({msg: "Succesfully added pokemon"})
            })
        })

        

    } catch (error) {
        next(error)
        
    }
})

app.put("/pokemon/:id", (req, res, next) => {
    try {
        let pokemonId = req.params.id;
        let updatedPokemon = req.body;

        fs.readFile(file, (err, data) => {
            if(err){
                console.log(err);
                throw err;
            }

            let pokemonArray = JSON.parse(data).map((pokemon) => {
                if(pokemon.id == pokemonId){
                    updatedPokemon.id = pokemon.id;
                    updatedPokemon.num = pokemon.num;
                    return updatedPokemon;
                }
                return pokemon;
                
            })

            fs.writeFile(file, JSON.stringify(pokemonArray), (err) => {
                if(err){
                    console.log(err);
                    throw err;
                }
                res.status(200).json({msg: "Succesfully updated pokemon", data: updatedPokemon,})
            })
        })

        

    } catch (error) {
        next(error)
        
    }
})

app.delete("/pokemon/:id", (req, res, next) => {
    try {
        let pokemonId = req.params.id;

        fs.readFile(file, (err, data) => {
            if(err){
                console.log(err);
            }

            let pokemonArray = JSON.parse(data).filter(({id}) => id != pokemonId)

            fs.writeFile(file, JSON.stringify(pokemonArray), (err) => {
                if(err){
                    console.log(err);
                    throw err;
                }
                res.status(200).json({msg: "Succesfully removed pokemon", data: pokemonId,})
            })
        })

        

    } catch (error) {
        next(error)
        
    }

})

app.get("*", (req, res, next) => {
    try {
        res.status(404).sendFile(path.join(__dirname, "./pages/notFound.html"))
    } catch (error) {
        next(error);
    }
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({name: err, msg: err.message || "Server error"})
})

app.listen(3000, () => console.log("Server is listening..."))

