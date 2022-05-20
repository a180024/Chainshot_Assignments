import EC from "elliptic";
import SHA256 from "crypto-js/sha256.js";

let ec = new EC.ec("secp256k1");

let args = process.argv.slice(2);
const privateKey = args[0];
const recipient = args[1];
const amount = args[2];

// Sign message
const key = ec.keyFromPrivate(privateKey, "hex");
const sender = key.getPublic().encode("hex");
const tx = { recipient, amount };
const signature = key.sign(SHA256(JSON.stringify(tx)).toString());

const body = JSON.stringify({
  tx,
  signature,
  sender,
});

console.log(body);
