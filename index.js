import express from "express";


const app = express();
app.get("/", (req, res) => {
    res.send("We are on home page");
    }
);

app.listen(3001, () => console.log("Server Started"));