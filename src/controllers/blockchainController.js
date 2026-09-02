import Blockchain from "../models/Blockchain.js";

const blockchain = new Blockchain();

export function getChain(req, res) {
  res.status(200).json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions
  });
}

export function createTransaction(req, res, next) {
  try {
    blockchain.addTransaction(req.body);

    res.status(201).json({
      message: "Transaction added to pending pool",
      transaction: req.body
    });
  } catch (error) {
    next(error);
  }
}

export function mineBlock(req, res, next) {
  try {
    const block = blockchain.minePendingTransactions();

    res.status(201).json(block);
  } catch (error) {
    next(error);
  }
}

export { blockchain };