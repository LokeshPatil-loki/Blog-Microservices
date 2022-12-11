const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4002;
const posts = {}; // Store

app.use(express.json());
app.use(cors());


app.get("/posts",(req,res) => {
    res.send(posts);
});

app.post("/events",(req,res) => {
    const {type, data} = req.body;
    if(type === "PostCreated"){
        const {id, title} = data;
        posts[id] = {id,title,comments:[]};
    }
    if(type === "CommentCreated"){
        const {id, content, postId} = data;
        posts[postId].comments.push({id, content});
    }
    console.log(type, posts);
});

app.listen(PORT, () => console.log("Listening on " + PORT));