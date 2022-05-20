import SHA256 from "crypto-js/sha256.js";

class Block {
  constructor(previousHash) {
    this.timestamp = Date.now();
    this.nonce = 0;
    this.transactions = [];
    this.previousHash = previousHash;
  }
  addTransaction(tx) {
    this.transactions.push(tx);
  }
  hash() {
    return SHA256(
      this.timestamp +
        "" +
        this.nonce +
        "" +
        JSON.stringify(this.transactions) +
        "" +
        this.previousHash
    ).toString();
  }
  mine(targetDifficulty) {
    const TARGET_DIFFICULTY = BigInt("0x0" + "F".repeat(64 - targetDifficulty));
    while (BigInt("0x" + this.hash()) >= TARGET_DIFFICULTY) {
      this.nonce++;
    }
    return this.hash();
  }
}

export default Block;
