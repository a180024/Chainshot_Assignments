import Block from "./Block.js";

class Blockchain {
  constructor() {
    this.blocks = [new Block()]; // Genesis Block
    this.targetDifficulty = 1;
  }
  addBlock(block) {
    this.blocks.push(block);
  }
  getLatestBlock() {
    return this.blocks[this.blocks.length - 1];
  }
  getBlockHeight() {
    return this.blocks.length;
  }
}

export default Blockchain;
