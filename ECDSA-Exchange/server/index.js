let express = require("express");
let SHA256 = require("crypto-js/SHA256");
let EC = require("elliptic").ec;
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
  const { tx, signature, sender } = req.body;
  // Verify that the signature comes from the sender(public key)
  const key = ec.keyFromPublic(sender, "hex");
  const hash = SHA256(JSON.stringify(tx)).toString();
  console.log(tx);
  if (key.verify(hash, signature)) {
    balances[sender] -= tx.amount;
    balances[tx.recipient] = (balances[tx.recipient] || 0) + +tx.amount;
    console.log("sender balance", balances[sender]);
    console.log("recipient balance", balances[tx.recipient]);
    res.send({ balance: balances[sender] });
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
