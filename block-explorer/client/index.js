import "./index.scss";
import axios from "axios";
const server = "http://localhost:3042";

document
  .getElementById("public-address")
  .addEventListener("input", async ({ target: { value } }) => {
    if (value === "") {
      document.getElementById("balance").innerHTML = 0;
      return;
    }

    const response = await axios.get(`${server}/balance/${value}`);
    document.getElementById("balance").innerHTML =
      Math.round(response.data.balance * 10000) / 10000;
    console.log(response.data.isContract);
    let html = "";
    if (response.data.isContract) {
      html = "<p> Contract: True" + "</p>";
    } else {
      html = "<p> Contract: False" + "</p>";
    }
    document.getElementById("is-contract").innerHTML = html;
  });

document.getElementById("get-latest").addEventListener("click", async () => {
  const response = await axios.get(`${server}/block`);
  const latestBlock = response.data.block;
  let html = "";
  html +=
    "<p> Latest Block Hash: " +
    latestBlock.hash +
    "</p>" +
    "<p> Miner: " +
    latestBlock.miner +
    "</p>";
  document.getElementById("block-info").innerHTML = html;
});
