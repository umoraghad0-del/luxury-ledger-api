# Luxury Ledger API

## About the Project

Luxury Ledger API is a Node.js and Express backend project that demonstrates how blockchain technology can be used to track ownership transfers of luxury products.

The project uses SHA-256 hashing, Proof of Work, blockchain validation, state validation, and REST API endpoints.

Each luxury product is identified by a unique serial number. The system tracks ownership changes and prevents users from transferring a product they do not currently own.

## Technologies

- Node.js
- JavaScript
- Express
- Node.js Crypto module
- dotenv
- Vitest
- Supertest
- Git and GitHub

## Luxury Product Transaction

A transaction contains:

```json
{
  "serialNumber": "BAG-001",
  "fromAddress": "0xManufacturer",
  "toAddress": "0xCollectorA",
  "timestamp": 1788368473841
}
```

- `serialNumber` identifies the product
- `fromAddress` is the current owner
- `toAddress` is the new owner
- `timestamp` records when the transfer happened

## How the Blockchain Works

The blockchain starts with a genesis block.

When a transaction is created, it is first added to the pending transaction pool. The pending transactions are then included in a new block when the mining endpoint is called.

Each block contains:

- Index
- Timestamp
- Transaction data
- Previous block hash
- Nonce
- SHA-256 hash

Each block references the hash of the previous block, creating a chain.

## Proof of Work

The project uses a simple Proof of Work mechanism.

During mining, the nonce is increased until the block hash starts with the required number of zeros.

The mining difficulty can be configured using the environment variable:

```env
POW_DIFFICULTY=1
```

## Deterministic Hashing

Before a block is hashed, its data is serialized in a stable order.

This ensures that objects containing the same data produce the same hash even if their keys were originally written in a different order.

## Ownership Validation

The blockchain keeps track of the current owner of each product.

A product can only be transferred by its current owner. If another address attempts to transfer the product, the transaction is rejected.

For the first transaction of a product, the sender can be the manufacturer. After the transaction has been mined, the receiver becomes the current owner.

An invalid ownership transfer returns:

```json
{
  "error": "Transaction rejected: sender is not the current owner"
}
```

with HTTP status:

```text
422 Unprocessable Entity
```

## API Endpoints

### Get the Blockchain

```http
GET /api/blockchain
```

Returns the current blockchain and pending transactions.

### Create a Transaction

```http
POST /api/transactions
```

Example request body:

```json
{
  "serialNumber": "BAG-001",
  "fromAddress": "0xManufacturer",
  "toAddress": "0xCollectorA",
  "timestamp": 1788368473841
}
```

A valid transaction is added to the pending transaction pool.

Required fields are:

- `serialNumber`
- `fromAddress`
- `toAddress`
- `timestamp`

Missing required data returns HTTP status `400`.

An invalid ownership transfer returns HTTP status `422`.

### Mine Pending Transactions

```http
POST /api/mine
```

Creates a new block containing the pending transactions and performs Proof of Work before adding the block to the blockchain.

### Verify a Product

```http
GET /api/products/:serialNumber/verify
```

Checks a product using its serial number.

The endpoint returns information about the current owner and the validity of the blockchain.

If the product does not exist, the API returns HTTP status `404`.

## Error Handling

The API includes middleware for validation, unknown routes, and centralized error handling.

Examples of HTTP status codes used by the API:

- `200` - Successful request
- `201` - Transaction created
- `400` - Missing or invalid request data
- `404` - Route or product not found
- `422` - Transaction rejected because of ownership validation
- `500` - Internal server error

## Project Structure

```text
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── app.js
└── server.js

tests/
├── Block.test.js
├── Blockchain.test.js
└── api.test.js
```

The project follows an MVC-like structure to separate blockchain logic, routes, controllers, middleware, and application configuration.

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=3000
POW_DIFFICULTY=1
```

## Run the Application

Start the server with:

```bash
node src/server.js
```

The API runs on:

```text
http://localhost:3000
```

unless another port is configured in the environment.

## Testing

The project uses Vitest for unit tests and Supertest for API integration tests.

Run all tests with:

```bash
npm test
```

The test suite covers:

- SHA-256 block hashing
- Proof of Work
- Deterministic hashing
- Genesis block creation
- Adding transactions
- Mining blocks
- Ownership validation
- Blockchain API
- Transaction API
- Request validation
- Unknown routes
- Invalid ownership transfers
- Mining endpoint
- Product verification

At the current stage, the project has 15 passing automated tests.

## Example Flow

A typical ownership transfer works like this:

1. A manufacturer transfers a product to a collector.
2. The transaction is added to the pending transaction pool.
3. The mining endpoint creates a new block.
4. Proof of Work is performed.
5. The block is added to the blockchain.
6. The collector becomes the current owner.
7. Only the current owner can make the next valid transfer.
8. The product can be verified using its serial number.

## Author

Najma Hasan