const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config()
const port = process.env.PORT || 5000;



// middleware 
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w2tuwt2.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const userCollection = client.db("fullStackDb").collection("users");

      app.get('/users', async (req, res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.findOne(query)
      res.send(result)
  })
    //  app.get('/users', async(req, res) => {
    //   const result = await userCollection.find().toArray();
    //  })

    app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result);
      
  });


  
         //  update user profile
         app.get('/users/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)}
          const result = await userCollection.findOne(query);
          res.send(result);
        });
    
    // update profile
    
 

    // ...

app.patch('/users/:id', async (req, res) => {
  try {
    const data = req.body;  // Fixed: Use 'data' instead of 'user'
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        name: data.name,
        email: data.email,
        phone: data.number,
        gender: data.gender,
        hear: data.hear,
        city: data.city,
        state: data.state,
        role: 'users',
        photo: data.photoURL,
      },
    };
    const result = await userCollection.updateOne(filter, updatedDoc);

    if (result.modifiedCount > 0) {
      res.status(200).json({ updated: true });
    } else {
      res.status(404).json({ updated: false });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ...


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res) => {
    res.send('full stack is running')
})

app.listen(port , () => {
    console.log(`Full stack is running on port ${port}`);
})