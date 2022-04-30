const express = require("express");
const EC = require("elliptic").ec;
const app = express();
const cors = require("cors");
const port = 3042;

// Generate keys and balance
let balances = {};
let ec = new EC("secp256k1");
for (let i = 0; i < 3; i++) {
  const key = ec.genKeyPair();
  const publicKey = key.getPublic().encode("hex");
  const privateKey = key.getPrivate("hex");
  console.log(`publicKey ${i + 1}`, publicKey);
  console.log(`privateKey ${i + 1}`, privateKey);
  balances[publicKey] = 100;
}

// var ec = new EC("secp256k1");
// var key = ec.genKeyPair();
// console.log("key", key.getPublic().encode("hex"));
// console.log("priv", key.getPrivate());
// const balances = {
// 1: 100,
// 2: 50,
// 3: 75,
// };

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  console.log("Balance", balance);
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  console.log("sender balance", balances[sender]);
  console.log("recipient balance", balances[recipient]);
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
