const express = require('express')
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken')


// console.log(process.env);

const mongoUtil = require('./MongoUtil');
const { ObjectId } = require('mongodb');
const app = express();

app.use(express.json())
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME; 
const TOKEN_SECRET = process.env.TOKEN_SECRET; 


function generateAccessToken(id, email) {
    return jwt.sign({
        'id' : id,
        "email" : email,
    
    }, TOKEN_SECRET,{
         'expiresIn' : '24h'
})
}

function checkIfAuthenticatedJWT(req,res,next) { 

        if (req.headers.authorization){
            const headers = req.headers.authorization;
            const token = headers.split(" ")[1]; 

        //verify if token is  valid
        jwt.verify(token, TOKEN_SECRET, function (err, tokenData){
   
        if (err) {
            res.status(403);
            res.json ({
                'error' : "Your token is invalid"
            })
            return;
        }

        req.user = tokenData
        
        next();
    })

        } else {
        res.status(403);
        res.message ({
            'error' : "Please provide access token to access this route"
        })
    }       
}


async function main() {
   const db = await mongoUtil.connect(MONGO_URI, DB_NAME);

//Read

   app.get('/', function (req, res) {
        res.json({
            'message':'assignment 2'
        });
   })

   app.get('/routines', async function (req,res){

    let criteria = {};

    if (req.query.mainGoal) {
        criteria.mainGoal = {
            '$regex': req.query.mainGoal,
            'options': 'i'
        }
    }

    if (req.query.workoutType) {
        criteria.workoutType = {
            '$regex': req.query.workoutType,
            'options': 'i'
        }
    }

    if (req.query.intensity) {
        criteria.intensity = {
            '$regex': req.query.intensity,
            'options': 'i'
        }
    }

    if (req.query.equipmentNeeded) {
        criteria.equipmentNeeded = {
            '$regex': req.query.equipmentNeeded,
            'options': 'i'
        }
    }

    if (req.query.min_durationInMinutes){
        criteria.durationInMinutes = {
            '$gte':parseInt(req.query.min_durationInMinutes)
        }
    }

    if (req.query.exercises){
        criteria.exercises = {
            '$regex': req.query.exercises,
            '$gte':parseInt(req.query.exercises)
        }
    }

    // console.log("criteria=", criteria);

    const routines = await db.collection('routines').find(criteria).toArray();
    res.json(routines);
    })

// Create

    app.post('/routines', async function (req,res){
        await db.collection('routines').insertOne({
            "mainGoal" : req.body.mainGoal,
            "workoutType": req.body.workoutType,
            "intensity": req.body.intensity,
            "equipmentNeeded": req.body.equipmentNeeded,
            "durationInMinutes": req.body.durationInMinutes,
            "exercises":req.body.exercises
        })
        res.json({
            'message':'created'
        })

    })

//Update

    app.put('/routines/:routinesId', async function (req,res){
        console.log(req.params.routinesId);

        await db.collection('routines').updateOne({
            '_id': ObjectId(req.params.reviewId)
        },{
            "$set":{
                "mainGoal" : req.body.mainGoal,
                "workoutType": req.body.workoutType,
                "intensity": req.body.intensity,
                "equipmentNeeded": req.body.equipmentNeeded,
                "durationInMinutes": req.body.durationInMinutes,
                "exercises":req.body.exercises
            }
        });
        
        res.json({
            'message':'put received'
        })
    });

    //Update with comment

    app.put('/routines/:routinesId/comments', async function (req,res){
        console.log(req.params.routinesId);

        await db.collection('routines').updateOne({
            '_id': ObjectId(req.params.routinesId)
        },{
            "$set":{
                'comment': req.body.comment,
                'name': req.body.name
            }
        });
        
        res.json({
            'message':'put received'
        })
    });

    app.delete('/routines/:routinesId', async function (req,res){
        console.log(req.params.routinesId);

        await db.collection('routines').deleteOne({
            '_id': ObjectId(req.params.routinesId)
        });
        
        res.json({
            'message':'deleted'
        })
    });

    //POST /users 

    app.post('/users', async function (req,res){
        const results = await db.collection('users').insertOne({
                "email": req.body.email,
                "password": req.body.password
        });
    
        res.json ({
                "message" : "user has been created",
                "results" : results
        })
    })

    app.post('/login', async function (req,res){
        const user = await db.collection('users').findOne({
            'email' : req.body.email,
            'password' : req.body.password
        });
        if (user) {
            let token = generateAccessToken (user._id, user.email);
            res.json ({
                'accessToken' : token 
            })
        
        } else {
            res.status(401);
            res.json({
                'message' : 'Invalid Email and or Password'
            })
        }
    })

    //Get the user profile
    app.get('/users/:userId', checkIfAuthenticatedJWT,  async function (req,res){
        
        res.json({
            'email' : tokenData.email,
            'id': tokenData.id,
            'message' : "You are viewing your profile"
        })

    })

    
}
main();

app.listen(3000, function(){
    console.log('server has started')
})