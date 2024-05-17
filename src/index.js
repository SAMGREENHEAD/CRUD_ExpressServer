import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { mockUsers } from "./utils/constants.js";
import mongoose from "mongoose";
import "./strategies/local-strategy.js";

const app = express();

mongoose
  .connect("mongodb://localhost:27017/express")
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "anson the dSev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

//enable passport before creating routes

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

const PORT = process.env.PORT || 3001;

//defining routes
app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.cookie("hello", "world", { maxAge: 30000, signed: true });
  res.status(201).send({ msg: `hello` });
});

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;
  const finduser = mockUsers.find((user) => user.username === username);
  if (!finduser || finduser.password !== password)
    return res.status(401).send({ msg: "bad credentials" });

  req.session.user = finduser;
  return res.status(200).send(finduser);
});

app.get("/api/auth/status/", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "not authenticated" });
});

app.post("/api/cart/", (req, res) => {
  if (!req.session.user)
    return res.status(401).send({ msg: " not authenticated" });
  const { body: item } = req;

  const { cart } = req.session;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(200).send(item);
});

app.get("/api/cart", (req, res) => {
  if (!req.session.cart) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
});

app.post("/api/authe", passport.authenticate("local"), (req, res) => {
  return res.sendStatus(200);
});

app.get("/api/auth/status", (req, res) => {
  console.log("req.user");
  console.log(req.session);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    return res.sendStatus(200);
  });
});
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
