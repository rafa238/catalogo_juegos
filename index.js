const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const hbs = require("hbs");
const dbConnection = require(__dirname + "/modelo/conexion.js");
const connection = dbConnection();
const multer = require('multer');

//<--body-parser-->
app.use(bodyParser.urlencoded({ extended:false})) 

//<--static-->
app.use(express.static(__dirname + "/public"));

//<---HBS--->
hbs.registerPartials(__dirname + "/views/parciales");
app.set("view engine", "hbs")


app.get("/", (req, res) => {
    connection.query("SELECT * FROM juego INNER JOIN estudio ON juego.id_estudio = estudio.id_estudio ", (err, result) =>{
        if(err){
            console.log("Error en consulta");
        }else{
            console.log(result);
            res.render("inicio",{juegos: result});
        }
    });
});

app.get("/addgame", (req, res) =>{
    connection.query("SELECT * FROM estudio", (err, result) => {
        if(err){
            console.log(err)
        }else{
            res.render("añadir", {estudios : result});
        }
    });
});

//<--multer-->
const storage = multer.diskStorage({
    destination: __dirname + "/public/imagenes",
});

const upload = multer({
    storage
}).single("image");

app.post("/addgame", upload ,(req, res) => {
    let nombre_juego = req.body.nombrejuego;
    let descripcion_juego = req.body.descripcion;
    let estudio = req.body.estudio;
    let clasificacion = req.body.clasificacion;
    let imagen = "imagenes/" + req.file.filename;
   
    console.log(nombre_juego, descripcion_juego, estudio, clasificacion, imagen);
    connection.query(`INSERT INTO juego VALUES (default, "${nombre_juego}", "${imagen}", ${estudio}, "${clasificacion}", "${descripcion_juego}")`, (err, result) =>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/")
        }
    })
});

app.post("/update" ,(req, res) => {
    let id = req.body.id;
    let nombre_juego = req.body.nombrejuego;
    let descripcion_juego = req.body.descripcion;
    let estudio = req.body.estudio;
    let clasificacion = req.body.clasificacion;

    console.log(id, nombre_juego, descripcion_juego, estudio, clasificacion);
    let data = [nombre_juego,clasificacion, descripcion_juego]
    connection.query(`UPDATE juego SET nombre=?, id_estudio=${estudio}, clasificacion=?, descripcion=? WHERE id_juego=${id}`,data ,(err, result) =>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/")
        }
    })
});

app.get("/update/:id", (req, res) => {
    const {id} = req.params;
    connection.query(`SELECT * FROM juego WHERE id_juego = ${id} `, (err, result) =>{
        if(err){
            console.log("Error en consulta");
            res.send("<script>alert('Error')</script>");
            res.redirect("/");
        }else{
            console.log(result);
            connection.query("SELECT * FROM estudio", (err2, result2) => {
                if(err2){
                    console.log("Error en consulta");
                    res.send("<script>alert('Error')</script>");
                    
                }else{
                    console.log(result2);
                    res.render("modificar",{juego: result, estudios : result2});
                }
            });
        }
    });
});

app.get("/delete/:id", (req, res) => {
    const {id} = req.params;
    connection.query(`DELETE FROM juego WHERE id_juego = ${id} `, (err, result) =>{
        if(err){
            console.log("Error en consulta");
            res.send("<script>alert('Error')</script>");
        }else{
            console.log(result);
            res.redirect("/");
        }
    });
});

app.get("/addstudio", (req, res) =>{
    res.render("estudio");
});

app.post("/addstudio", (req, res) => {
    let nombre_estudio = req.body.nombreestudio;
    connection.query(`INSERT INTO estudio VALUES (default, "${nombre_estudio}")`, (err, result) =>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/")
        }
    })
});

app.listen(3000, () =>{
    console.log("Servidor escuchando en puerto 3000");
});