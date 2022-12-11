const express = require("express");
const axios = require("axios");
const PORT = 4003;
const app = express();

app.post("/events", (req, res) => {
    
});

app.listen(PORT,() => console.log("Listening on " + PORT))