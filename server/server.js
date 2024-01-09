
if(process.env.NODE_ENV != "production"){
    require("dotenv").config()

}

const express = require('express')
const cors = require("cors");
const bodyParser = require('body-parser')
const connectToDB = require("./config/connectToDB")
const storeDataController = require('./controllers/storeDataController')


const app = express()

app.use(express.json())
app.use(bodyParser.json({limit: '100kb'}));
app.use(cors());

connectToDB()

app.get('/', (req, res) =>{
    res.json({hello: "world"})
})


app.get("/stores", storeDataController.fetchStoreDataSets);
app.get("/stores/:id", storeDataController.fetchStoreData);
app.post("/stores", storeDataController.createStoreData);
app.put("/stores/:id", storeDataController.updateStoreData);
app.delete("/stores/:id", storeDataController.deleteStoreData);

app.post("/scan", storeDataController.scanStore)
app.post("/scan/end", storeDataController.endScan)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
