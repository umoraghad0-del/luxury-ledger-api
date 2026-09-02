import Block from "./Block.js";

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = Number(process.env.POW_DIFFICULTY) || 1;
  }

  createGenesisBlock() {
    return new Block(
      0,
      Date.now(),
      [],
      "0"
    );
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  getCurrentOwner(serialNumber) {
  let currentOwner = null;

  for (const block of this.chain) {
    for (const transaction of block.data) {
      if (transaction.serialNumber === serialNumber) {
        currentOwner = transaction.toAddress;
      }
    }
  }

  return currentOwner;
}

addTransaction(transaction) {
  const currentOwner = this.getCurrentOwner(transaction.serialNumber);

if (currentOwner && currentOwner !== transaction.fromAddress) {
  const error = new Error(
    "Transaction rejected: sender is not the current owner"
  );

  error.statusCode = 422;
  throw error;
}

  this.pendingTransactions.push(transaction);
}

  minePendingTransactions() {
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    newBlock.mineBlock(this.difficulty);

    this.chain.push(newBlock);
    this.pendingTransactions = [];

    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

export default Blockchain;