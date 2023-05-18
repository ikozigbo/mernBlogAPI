const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const salt = bcrypt.genSaltSync(10);
const secret = "gekjirfjmo658493ghdnmewwsmndbn";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  "mongodb+srv://ikozigbo:ikponmwosa123@cluster0.b3dt4vh.mongodb.net/?retryWrites=true&w=majority"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      //logged in
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) {
          throw err;
        } else {
          res.cookie("token", token).json("ok");
        }
      });
      //res.json()
    } else {
      res.status(400).json("wrong credentials");
    }
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  res.json(req.cookies);
});

app.listen(4000);
//
