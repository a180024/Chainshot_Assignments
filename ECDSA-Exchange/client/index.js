import "./index.scss";
let EC = require("elliptic").ec;
let SHA256 = require("crypto-js/SHA256");

let ec = new EC("secp256k1");

const server = "http://localhost:3042";

document
  .getElementById("exchange-address")
  .addEventListener("input", ({ target: { value } }) => {
    if (value === "") {
      document.getElementById("balance").innerHTML = 0;
      return;
    }

    fetch(`${server}/balance/${value}`)
      .then((response) => {
        return response.json();
      })
      .then(({ balance }) => {
        document.getElementById("balance").innerHTML = balance;
      });
  });

document.getElementById("transfer-amount").addEventListener("click", () => {
  // const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;
  const privateKey = document.getElementById("private-key").value;

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

  const request = new Request(`${server}/send`, { method: "POST", body });

  fetch(request, { headers: { "Content-Type": "application/json" } })
    .then((response) => {
      return response.json();
    })
    .then(({ balance }) => {
      document.getElementById("balance").innerHTML = balance;
    });
});
