import express from "express";
import { validateTransaction } from "../middleware/validateTransaction.js";
import {getChain,createTransaction,mineBlock,verifyProduct} from "../controllers/blockchainController.js";

const router = express.Router();

router.get("/blockchain", getChain);
router.post("/transactions",validateTransaction, createTransaction);
router.post("/mine", mineBlock);
router.get("/products/:serialNumber/verify", verifyProduct);

export default router;