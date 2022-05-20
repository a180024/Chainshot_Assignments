const ethers = require("ethers");
const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const url = process.env.RINKEBY_URL;
const provider = new ethers.providers.JsonRpcProvider(url);

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

app.get("/balance/:address", async (req, res) => {
  let isContract = false;
  const { address } = req.params;
  console.log(address);
  const balance = await provider.getBalance(address);
  const _balance = ethers.utils.formatEther(balance);
  console.log(_balance);
  const byteCode = await provider.getCode(address);
  console.log(byteCode);
  if (byteCode !== "0x") {
    isContract = true;
  }
  res.send({ balance: _balance, isContract });
});

app.get("/block", async (req, res) => {
  const block = await provider.getBlock("latest");
  console.log(block);
  res.send({ block });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
