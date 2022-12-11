const express = require("express");
const axios = require("axios");
const PORT = 4005;

const app = express();
app.use(express.json());

app.post("/events",(req,res) => {
    const event = req.body;
    axios.post("http://localhost:4000/events",event).catch(err => console.log(err.message));
    axios.post("http://localhost:4001/events",event).catch(err => console.log(err.message));
    axios.post("http://localhost:4002/events",event).catch(err => console.log(err.message));

    res.send({status: "OK"})
})

app.listen(PORT,()=>console.log("listening on " + PORT));