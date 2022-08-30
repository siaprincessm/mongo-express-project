const express = require('express')
const cors = require('cors');
require('dotenv').config();


// console.log(process.env);

const mongoUtil = require('./MongoUtil');
const { ObjectId } = require('mongodb');
const app = express();

app.use(express.json())
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;


async function main() {
   const db = await mongoUtil.connect(MONGO_URI, DB_NAME);

//Read

   app.get('/', function (req, res) {
        res.json({
            'message':'i love candies and pastries'
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

    if (req.query.min_durationInMinutes){
        criteria.durationInMinutes = {
            '$gte':parseInt(req.query.min_durationInMinutes)
        }
    }

    if (req.query.min_durationInMinutes){
        criteria.durationInMinutes = {
            '$gte':parseInt(req.query.min_durationInMinutes)
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

}
main();

app.listen(3000, function(){
    console.log('server has started')
})