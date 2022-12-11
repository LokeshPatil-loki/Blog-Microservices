const express = require("express");
const axios = require("axios");
const PORT = 4003;
const app = express();

app.use(express.json());

app.post("/events", async (req, res) => {
    console.log(req.body)
    const {type, data} = req.body;

    if(type === "CommentCreated"){
        const status = data.content.includes("orange") ? "rejected" : "approved";
        await axios.post("http://localhost:4005/events", {
            type: "CommentModerated",
            data: {
                ...data,
                status: status
            }
        }).catch(err => console.log(err));
    }

    res.send({})
});

app.listen(PORT,() => console.log("Listening on " + PORT))