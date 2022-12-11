const express = require("express");
const axios = require("axios");
const PORT = 4003;
const app = express();

app.post("/events", async (req, res) => {
    const {type, data} = req.body;

    if(type === "CommentCreated"){
        const status = data.content.includes("orange") ? "rejected" : "approved";
        await axios.post("http://localhost:4005/events", {
            type: "CommentModerated",
            data: {
                ...data,
                status: status
            }
        })
    }

    res.send({})
});

app.listen(PORT,() => console.log("Listening on " + PORT))