const express = require('express')
const cors = require('cors');

const mongoUtil = require('./MongoUtil');

const app = express();

app.use(express.json())
app.use(cors());

const MONGO_URI = "mongodb+srv://siaprincessm:66yqjw686lK5x6QP@cluster0.pqwqho7.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "dwad_e_exercises";


async function main() {
   const db = await mongoUtil.connect(MONGO_URI, DB_NAME);

   app.get('/', function (req, res) {
        res.json({
            'message':'i love candies and pastries'
        });
   })

    app.post('/reviews', async function (req,res){
        await db.collection('reviews').insertOne({
            "_id":"123",
            "title":"Good Steak",
            "food":"Sirloin Steak",
            "Content":"perfectly cooked steak",
            "Rating":"7"
        })
        res.json({
            'message':'ok'
        })

    })
}

main();

app.listen(3000, function(){
    console.log('server has started')
})