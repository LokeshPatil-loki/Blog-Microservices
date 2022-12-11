const express = require("express");
const app = express();
const {randomBytes} = require("crypto");
const cors = require("cors");
const axios = require("axios");

const PORT = 4001;

app.use(express.json());
app.use(cors());
const commentsByPostId = {}

app.get("/posts/:id/comments", (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req,res) => {
    const commentId = randomBytes(4).toString("hex");
    const {content} = req.body;
    
    const comments = commentsByPostId[req.params.id] || [];

    comments.push({
        id: commentId,
        content, 
    });

    commentsByPostId[req.params.id] = comments;

	console.log(comments);

    await axios.post('http://localhost:4005/events',{
        type: "CommentCreated",
        data: {
            id: commentId,
            content, 
            postId: req.params.id
        }
    }).catch(err => console.log(err));

    res.status(201).send(comments);

});

app.post("/events", (req, res) => {
    console.log("Recieved Event:",req.body.type);
});

app.listen(PORT,() => console.log("Listening on " + PORT));