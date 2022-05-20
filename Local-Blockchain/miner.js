import Block from "./models/Block.js";
import Blockchain from "./models/Blockchain.js";
import Transaction from "./models/Transaction.js";
import Mempool from "./mempool.js";
import EC from "elliptic";
import SHA256 from "crypto-js/sha256.js";
const bc = new Blockchain();
const mem = new Mempool();
let _ec = new EC.ec("secp256k1");

function startMining() {
  const latestBlockHash = bc.getLatestBlock().hash();
  const block = new Block(latestBlockHash);
  const targetDifficulty = bc.targetDifficulty;
  // Add txs from mempool
  block.transactions = mem.transactions;
  mem.clearPool();

  const hash = block.mine(targetDifficulty);
  bc.addBlock(block);
  console.log(
    `Mined block #${bc.getBlockHeight()} with a hash of ${block.hash()} with #${
      block.transactions.length
    } transactions at nonce ${block.nonce}`
  );
  setTimeout(startMining, 10000);
}

function addTx(data) {
  const { tx, signature, sender } = data;
  console.log(tx);
  console.log(signature);
  console.log(sender);
  // Verify that the signature comes from the sender(public key)
  const key = _ec.keyFromPublic(sender, "hex");
  const hash = SHA256(JSON.stringify(tx)).toString();
  if (key.verify(hash, signature)) {
    const pendingTx = new Transaction(sender, tx.recipient, tx.amount);
    mem.transactions.push(pendingTx);
    console.log(mem.transactions);
  }
}

export { startMining, addTx };
