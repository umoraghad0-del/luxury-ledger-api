import { describe, it, expect } from "vitest";
import Block from "../src/models/Block.js";

describe("Block", () => {
  it("should generate a SHA-256 hash", () => {
    const block = new Block(
      1,
      Date.now(),
      { serialNumber: "BAG-2026-001" },
      "previous-hash"
    );

    const hash = block.calculateHash();

    expect(hash).toHaveLength(64);
  });
  it("should mine a block with the required difficulty", () => {
  const block = new Block(
    1,
    Date.now(),
    { serialNumber: "BAG-2026-001" },
    "previous-hash"
  );

  block.mineBlock(2);

  expect(block.hash.startsWith("00")).toBe(true);
});

it("should generate the same hash for data with different key order", () => {
  const blockA = new Block(
    1, 123456,
    {
    serialNumber: "BAG-001", owner: "0xCollectorA" 
    },
    "previous-hash"
  );

  const blockB = new Block(
    1, 123456, {
      owner: "0xCollectorA", serialNumber: "BAG-001"},
      "previous-hash");

  expect(blockA.calculateHash()).toBe(blockB.calculateHash());
});
});