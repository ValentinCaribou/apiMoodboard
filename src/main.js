//L'application requiert l'utilisation du module Express.
//La variable express nous permettra d'utiliser les fonctionnalités du module Express.
const express = require('express');

// Nous définissons ici les paramètres du serveur.
const hostname = 'localhost';
const port = 3003;

const app = express();

// La variable mongoose nous permettra d'utiliser les fonctionnalités du module mongoose.
const mongoose = require('mongoose');
// Ces options sont recommandées par mLab pour une connexion à la base
const options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

//URL de notre base
const urlmongo = "mongodb://localhost:27017/Moodboard";

// Nous connectons l'API à notre base de données
mongoose.connect(urlmongo, options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Afin de faciliter le routage (les URL que nous souhaitons prendre en charge dans notre API), nous créons un objet Router.
//C'est à partir de cet objet myRouter, que nous allons implémenter les méthodes.
const myRouter = express.Router();

// Pour modéliser les données, le framework mongoose utilise des "schémas" ; nous créons donc un modèle de données :
const userSchema = mongoose.Schema({
    email: String,
    password:String,
    name:String,
    surname:String,
    alias:String,
});

const weekMoodSchema = mongoose.Schema({
    email: String,
    password:String,
    name:String,
    surname:String,
    alias:String,
});

const User = mongoose.model('User', userSchema);
// Je vous rappelle notre route (/piscines).
myRouter.route('/inscription')
// J'implémente les méthodes GET, PUT, UPDATE et DELETE
// GET
    .get(function(req,res){
        User.find(function(err, user){
            if (err){
                res.send(err);
            }
            res.json(user);
        });
    })
    //POST
    .post(function(req,res){
        // Nous utilisons le schéma Piscine
        const user = new User();
        console.log(req.body);
        // Nous récupérons les données reçues pour les ajouter à l'objet Piscine
        user.email = req.body.email;
        user.password = req.body.password;
        user.name = req.body.name;
        user.surname = req.body.surname;
        //Nous stockons l'objet en base
        user.save(function(err){
            if(err){
                res.send(err);
            }
            res.send({message : 'l\'utilisateur est bien enregistrer'});
        })
    })
    //PUT
    .put(function(req,res){
        res.json({message : "Mise à jour d'un inscrit'", methode : req.method});
    })
    //DELETE
    .delete(function(req,res){
        res.json({message : "Suppression d'un inscrit", methode : req.method});
    });

myRouter.route('/')
// all permet de prendre en charge toutes les méthodes.
    .all(function(req,res){
        res.json({message : "Bienvenue sur notre l'api Moodboard", methode : req.method});
    });

// Nous demandons à l'application d'utiliser notre routeur
app.use(myRouter);

// Démarrer le serveur
app.listen(port, hostname, function(){
    console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port+"\n");
});