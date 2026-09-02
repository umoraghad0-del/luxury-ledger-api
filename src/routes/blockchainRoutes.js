import express from "express";
import { validateTransaction } from "../middleware/validateTransaction.js";
import {getChain,createTransaction,mineBlock} from "../controllers/blockchainController.js";

const router = express.Router();

router.get("/blockchain", getChain);
router.post("/transactions",validateTransaction, createTransaction);
router.post("/mine", mineBlock);

export default router;