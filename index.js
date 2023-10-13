const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json())


// shamimraza411
// I9HBnnvtNPPggu8f



const uri = "mongodb+srv://shamimraza411:I9HBnnvtNPPggu8f@cluster0.liy9yg7.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("usersDB");
        const users = database.collection("users");

        app.get('/users', async (req, res) => {
            const cursor = users.find()
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await users.findOne(query)
            res.send(result)

        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user', user);
            const result = await users.insertOne(user);
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(user, id);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateUsers = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            const result = await users.updateOne(filter, updateUsers, options);
            res.send(result)


        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: new ObjectId(id) }
            const result = await users.deleteOne(query);
            res.send(result)

        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('SIMPLE CRUD OPERATION displAy')
})

app.listen(port, () => {
    console.log(`SIMPLE CRUD IS RUNNING, ${port}`);
})