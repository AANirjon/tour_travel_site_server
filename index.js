const express = require("express");
const { MongoClient, MONGO_CLIENT_EVENTS } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const { query } = require("express");
require("dotenv").config();
const app = express();

// PORT
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// connenting MongoDB
const uri = `mongodb+srv://ahnaf:ahnaf@cluster0.yfdrcxl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
async function run() {
    try {
        await client.connect()
        .then(console.log("database connected"))

       
        const database = client.db("tours");
        const tourServices = database.collection("tour");
        const serviceOrders = database.collection("orders");
        // const database = client.db("tourismDb");
        // const tourServices = database.collection("tourPack");
        // const serviceOrders = database.collection("orders");

        // Get All packages
        app.get("/packages", async (req, res) => {
            const cursor = tourServices.find({});
            const packages = await cursor.toArray();
            res.send(packages);
            // console.log(packages)
        });

        // Get Oneday Tours
        app.get("/oneDayTours", async (req, res) => {
            const query = { time: "1" };
            const cursor = tourServices.find(query);
            const tours = await cursor.toArray();
            res.send(tours);
        });

        // Get all Orders
        app.get("/orders", async (req, res) => {
            const cursor = serviceOrders.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // Get single order
        app.get("/order/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id:id };
            const order = await tourServices.findOne(query);
            res.send(order);
            console.log("order",order)
        });

        // get single Package
        app.get("/Packages/:id", async (req, res) => {
            console.log(req.params)
            const id = req.params.id;
            
            const query = { _id: id};
            // console.log("query",query)
            const package = await tourServices.findOne(query);
            console.log("pakage",package)
            res.send(package);
        });

        // Post New package
        app.post("/packages", async (req, res) => {
            const package = req.body;
            const result = await tourServices.insertOne(package);
            res.send(result);
        });

        // Post An Order
        app.post("/orders", async (req, res) => {
            const package = req.body;
            const result = await serviceOrders.insertOne(package);
            res.send(result);
        });

        // Upadate tour service
        app.put("/packages/:id", async (req, res) => {
            const id = req.params.id;
            const updatedTour = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updatedTour.title,
                    img: updatedTour.img,
                    price: updatedTour.price,
                    time: updatedTour.time,
                    type: updatedTour.type,
                    description: updatedTour.description,
                },
            };
            const result = await tourServices.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });

        // Delete tour service
        app.delete("/packages/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tourServices.deleteOne(query);
            res.send(result);
        });

        // cancel tour order
        app.delete("/orders/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log("qdel",query)

            const result = await serviceOrders.deleteOne(query);
            console.log("res",result)
            res.send(result);
        });
    } finally {
        // await client.close()
    }
}
run().catch(console.dir);

// Initial checkUP
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log("This server is run with port:", port);
});
