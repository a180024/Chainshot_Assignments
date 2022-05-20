import express from "express";
import bodyParser from "body-parser";
import { startMining, addTx } from "./miner.js";

const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/mine", (req, res) => {
  console.log("Starting to mine...");
  startMining();
});

// Tx, Signature, Sender
app.post("/send", (req, res) => {
  console.log("Sending a tx...");
  addTx(req.body);
});

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
