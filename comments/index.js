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
        status: "pending"
    });

    commentsByPostId[req.params.id] = comments;

	console.log(comments);

    await axios.post('http://event-bus-srv:4005/events',{
        type: "CommentCreated",
        data: {
            id: commentId,
            content, 
            postId: req.params.id,
            status: "pending"
        }
    }).catch(err => console.log(err));

    res.status(201).send(comments);

});

app.post("/events", async (req, res) => {
    const {type, data} = req.body;
    console.log("Recieved Event:",req.body.type);

    if(type === "CommentModerated"){
        const {postId, id , status} = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => comment.id === id);
        comment.status = status; 
        await axios.post("http://event-bus-srv:4005/events", {
            type:"CommentUpdated",
            data: {
                ...data,
                status: status
            }
        }).catch(err => console.log(err));
    }

    
    
});

app.listen(PORT,() => console.log("Listening on " + PORT));