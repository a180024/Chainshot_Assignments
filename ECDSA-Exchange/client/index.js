import "./index.scss";
let EC = require("elliptic").ec;
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
  const msgHash = "Authentication";
  const key = ec.keyFromPrivate(privateKey, "hex");
  const sender = key.getPublic().encode("hex");
  console.log("publicKey", sender);
  const signature = key.sign(msgHash);
  const derSign = signature.toDER();
  const isVerified = key.verify(msgHash, derSign);
  if (!isVerified) {
    alert("Failed to authenticate");
    return false;
  }
  console.log(isVerified);

  const body = JSON.stringify({
    sender,
    amount,
    recipient,
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
