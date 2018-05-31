const MONGO_DB = require('mongodb');
const CONNECTION_STR = 'mongodb://localhost:27017/vanillaMongoDB';

MONGO_DB.MongoClient.connect(CONNECTION_STR, (err, client) => {
    let db = client.db('vanillaMongoDB');
    let people = db.collection('people');

    people.insertOne({ 'name': 'John' }, (err, result) => {
        people.find({ 'name': 'John' }).toArray((err, data) => {
            console.log(data);
        });
    });
});