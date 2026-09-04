import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Blockchain API", () => {
  it("GET /api/blockchain should return the blockchain", async () => {
    const response = await request(app)
      .get("/api/blockchain");

    expect(response.status).toBe(200);
    expect(response.body.chain).toBeDefined();
    expect(response.body.pendingTransactions).toBeDefined();
  });
  it("POST /api/transactions should add a valid transaction", async () => {
  const transaction = {
    serialNumber: "BAG-TEST-001",
    fromAddress: "0xManufacturer",
    toAddress: "0xCollectorA",
    timestamp: Date.now()
  };

  const response = await request(app)
    .post("/api/transactions")
    .send(transaction);

  expect(response.status).toBe(201);
  expect(response.body.transaction.serialNumber).toBe("BAG-TEST-001");
});
it("POST /api/transactions should return 400 when required data is missing", async () => {
  const invalidTransaction = {
    fromAddress: "0xManufacturer",
    toAddress: "0xCollectorA",
    timestamp: Date.now()
  };

  const response = await request(app)
    .post("/api/transactions")
    .send(invalidTransaction);

  expect(response.status).toBe(400);
  expect(response.body.error).toBe(
    "serialNumber, fromAddress, toAddress and timestamp are required"
  );
});
it("should return 404 for an unknown route", async () => {
  const response = await request(app)
    .get("/api/does-not-exist");

  expect(response.status).toBe(404);
  expect(response.body.error).toBe("Route not found");
});
it("POST /api/transactions should return 422 when sender is not the current owner", async () => {
  await request(app)
    .post("/api/transactions")
    .send({
      serialNumber: "BAG-STATE-001",
      fromAddress: "0xManufacturer",
      toAddress: "0xCollectorA",
      timestamp: Date.now()
    });

  await request(app).post("/api/mine");

  const response = await request(app)
    .post("/api/transactions")
    .send({
      serialNumber: "BAG-STATE-001",
      fromAddress: "0xCollectorB",
      toAddress: "0xCollectorC",
      timestamp: Date.now()
    });

  expect(response.status).toBe(422);
  expect(response.body.error).toBe(
    "Transaction rejected: sender is not the current owner"
  );
});
it("POST /api/mine should mine pending transactions into a new block", async () => {
  await request(app)
    .post("/api/transactions")
    .send({
      serialNumber: "BAG-MINE-001",
      fromAddress: "0xManufacturer",
      toAddress: "0xCollectorA",
      timestamp: Date.now()
    });

  const response = await request(app)
    .post("/api/mine");

  expect(response.status).toBe(201);
  expect(response.body.hash).toBeDefined();
  expect(response.body.nonce).toBeDefined();
  expect(response.body.data).toHaveLength(1);
});
it("GET /api/products/:serialNumber/verify should return current owner and chain status", async () => {
  await request(app)
    .post("/api/transactions")
    .send({
      serialNumber: "BAG-VERIFY-001",
      fromAddress: "0xManufacturer",
      toAddress: "0xCollectorA",
      timestamp: Date.now()
    });

  await request(app).post("/api/mine");

  const response = await request(app)
    .get("/api/products/BAG-VERIFY-001/verify");

  expect(response.status).toBe(200);
  expect(response.body.serialNumber).toBe("BAG-VERIFY-001");
  expect(response.body.currentOwner).toBe("0xCollectorA");
  expect(response.body.blockchainValid).toBe(true);
});
it("GET /api/products/:serialNumber/verify should return 404 when product does not exist", async () => {
  const response = await request(app)
    .get("/api/products/DOES-NOT-EXIST/verify");

  expect(response.status).toBe(404);
  expect(response.body.error).toBe("Product not found");
});
});
