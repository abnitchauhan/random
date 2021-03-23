const express = require('express');
const path = require('path'); 
const dotenv = require('dotenv');   
const MongoClient = require('mongodb').MongoClient;

const app = express(); 
const port = 3000;

// Make Environment Variable available throughout the Application
dotenv.config();

// Database Connection
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uyq8g.mongodb.net/random?retryWrites=true&w=majority`;

// MongoClient Connection
    MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
        const db = client.db('random');
        const squareCollection = db.collection('square');
        console.log('Database Connection Established Successfully');   
    
 // Set Embeded Javascript
    app.set('view engine', 'ejs');
    
 // MiddleWares 
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.urlencoded({extended:true}));  

    app.post('/action', (req, res) =>{
         var response= {
            number: parseInt(req.body.number),
            square: Math.pow(req.body.number, 2)
        }
        squareCollection.insertOne(response)
        .then(result =>{
            res.redirect('/')
        })
        .catch(error => console.error(error))
    }); 

        app.get('/', (req,res) =>{
               
                const cursor = db.collection('square').find().toArray()
                .then(results =>{
                    res.render('index.ejs', {square: results});
                })
        })
        
    }) ; 

app.listen(port, ()=>{console.log(`Listening on Server localhost:${port}`)})