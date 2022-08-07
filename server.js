/** @format */

require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const port = process.env.PORT || 9001;
const staticDir = process.env.DEV ? "./client/public" : "./client/build";

// I don't think I'll be making logins, but you never know, I guess
// const bcrypt = require("bcrypt");

const url = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPass}@poker-game.ytigt.mongodb.net/poker`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(port, () => {
    console.log(`Loud and clear on ${port}`);
});

app.use(express.static(staticDir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//end basic setup

//database schema setup
// cards shouldn't need to be saved in the database, so not adding that rn
const dealerSchema = new mongoose.Schema(
    {
        name: { type: String },
        outfits: {
            type: Object,
            properties: {
                outfit1: { type: String },
            },
            additionalProperties: true,
        },
        tags: { type: Array, items: String },
    },
    { collection: "dealers" }
);

const Dealer = mongoose.model("Dealer", dealerSchema);

const outfitSchema = new mongoose.Schema(
    {
        dealerName: { type: String },
        outfitId: { type: String },
        pictures: { type: Array, items: String },
        tags: { type: Array, items: String },
    },
    { collection: "outfits" }
);

const Outfit = mongoose.model("Outfit", outfitSchema);

//CRUD
//if I decide to use Create, Update, and Delete I'll probably end up using bcrypt

//CREATE
app.get("/add", async (req, res) => {
    //not sure I'm going to use this, tbh
    //but it's here if I change my mind
    console.log("/add");
    let userObj = req.body;
    console.log("new items added");
    res.redirect("/");
});

//READ
//all

app.get("/api/dealerList", async (req, res) => {
    console.log("get dealer list");
    let dealers = await Dealer.find({});
    let dealerList = [];
    for (let dealer in dealers) {
        dealerList.push(dealers[dealer].name);
    }
    res.send(dealerList);
});

app.get("/api/dealers", async (req, res) => {
    console.log("get dealers");
    //should return dealer name, tags, and first pic, I think
    let dealers = await Dealer.find({});
    res.send(dealers);
});

app.get("/api/dealerShowcase", async (req, res) => {
    console.log("get outfits");

    let outfits = await Outfit.find({});

    let dealerShowcase = outfits
        .filter((outfit) => outfit.outfitId.includes("1"))
        .map((outfit) => {
            return {
                dealerName: outfit.dealerName,
                image: outfit.pictures[0],
                tags: outfit.tags,
            };
        });

    res.send(dealerShowcase);
});

//one
app.get("/api/dealer/:dealerName", async (req, res) => {
    console.log("get one dealer");
    let dealer = await Dealer.findOne({ name: req.params.dealerName });
    let outfits = await Outfit.find({ dealerName: req.params.dealerName });

    let response = outfits;
    response.unshift(dealer);

    res.send(response);
});

app.get("/api/play/:dealerName", async (req, res) => {
    console.log("get play/outfit");
    let dealerName = req.params.dealerName;

    let outfits = await Outfit.find({ dealerName: dealerName });
    let dealer = await Dealer.find({ name: dealerName });

    response = dealer.concat([outfits]);
    res.send(response);
});

//UPDATE
app.get("/edit", async (req, res) => {
    //not sure I'll use this either tbh
});
//DELETE
app.get("/remove", async (req, res) => {
    //again, may not use
});

//404 catch
//may do something fun with this, idk
app.get("/*", (req, res) => {
    res.status(404).send("Page Not Found");
});
