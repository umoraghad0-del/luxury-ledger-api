import { describe, it, expect } from "vitest";
import Blockchain from "../src/models/Blockchain.js";

describe("Blockchain", () => {
  it("should initialize with a genesis block", () => {
    const blockchain = new Blockchain();

    expect(blockchain.chain).toHaveLength(1);
  });

  it("should add a transaction to pending transactions", () => {
    const blockchain = new Blockchain();

    const transaction = {
      serialNumber: "BAG-2026-001",
      fromAddress: "0xManufacturer",
      toAddress: "0xCollectorA",
      timestamp: Date.now()
    };

    blockchain.addTransaction(transaction);

    expect(blockchain.pendingTransactions).toHaveLength(1);
  });

  it("should mine pending transactions into a new block", () => {
    const blockchain = new Blockchain();

    blockchain.addTransaction({
      serialNumber: "BAG-2026-001",
      fromAddress: "0xManufacturer",
      toAddress: "0xCollectorA",
      timestamp: Date.now()
    });

    const minedBlock = blockchain.minePendingTransactions();

    expect(blockchain.chain).toHaveLength(2);
    expect(blockchain.pendingTransactions).toHaveLength(0);
    expect(minedBlock.hash.startsWith("0")).toBe(true);
  });
});