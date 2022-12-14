const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = 4002;
const posts = {}; // Store

app.use(express.json());
app.use(cors());

const handleEvents = (type, data) => {
    if(type === "PostCreated"){
        const {id, title} = data;
        posts[id] = {id,title,comments:[]};
    }
    if(type === "CommentCreated"){
        const {id, content, postId, status} = data;
        posts[postId].comments.push({id, content, status});
    }
    if(type === "CommentUpdated"){
        const {id, content, postId, status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);
        comment.status = status;
        comment.content = content;
    }
}

app.get("/posts",(req,res) => {
    res.send(posts);
});

app.post("/events",(req,res) => {
    const {type, data} = req.body;
    handleEvents(type, data);
    console.log(type, posts);
});

app.listen(PORT, async () => {
    console.log("Listening on " + PORT);
    try {
        const res = await axios.get("http://event-bus-srv:4005/events");
        for(let event of res.data){
            console.log("Processing event:",event.type);
            handleEvents(event.type, event.data);
        }
    } catch (error) {
        console.log(error);
    }
});